import { describe, expect, it } from "vitest";
import {
  buildAgentCard,
  handleA2ARequest,
  type A2AContentDeps,
} from "./a2a";

const deps: A2AContentDeps = {
  listPosts: async (type) =>
    type === "work"
      ? [{ title: "Case study", slug: "case", url: "u" }]
      : [
          { title: "Hello world", slug: "hello", url: "u" },
          { title: "Case study", slug: "case", url: "u" },
        ],
  getPost: async (_t, slug) => (slug === "hello" ? "# Hello world" : null),
  listGears: async () => [{ category: "Desk", items: [{ title: "Keyboard" }] }],
  getProfile: async () => ({ name: "Nubelson Fernandes", url: "u", social: [] }),
};

const rpc = (method: string, params?: unknown, id: unknown = 1) =>
  handleA2ARequest({ jsonrpc: "2.0", id, method, params }, deps);

const userMessage = (parts: unknown[]) => ({
  message: { messageId: "m1", role: "ROLE_USER", parts },
});

describe("buildAgentCard", () => {
  const card = buildAgentCard("https://nublson.com");

  it("carries every field A2A v1.0 marks REQUIRED", () => {
    for (const field of [
      "name",
      "description",
      "supportedInterfaces",
      "version",
      "capabilities",
      "defaultInputModes",
      "defaultOutputModes",
      "skills",
    ]) {
      expect(card).toHaveProperty(field);
    }
  });

  it("points supportedInterfaces at the real A2A endpoint, not the MCP one", () => {
    expect(card.supportedInterfaces).toEqual([
      {
        url: "https://nublson.com/api/a2a",
        protocolBinding: "JSONRPC",
        protocolVersion: "1.0",
      },
    ]);
  });

  it("omits the v0.3 fields that v1.0 removed from AgentCard", () => {
    for (const removed of [
      "protocolVersion",
      "preferredTransport",
      "additionalInterfaces",
      "url",
    ]) {
      expect(card).not.toHaveProperty(removed);
    }
  });

  it("declares only capabilities the endpoint actually implements", () => {
    expect(card.capabilities).toEqual({
      streaming: false,
      pushNotifications: false,
    });
  });

  it("gives every skill the required id, name, description and tags", () => {
    expect(card.skills.length).toBeGreaterThan(0);

    for (const skill of card.skills) {
      expect(skill.id).toMatch(/^[a-z_]+$/);
      expect(skill.name.length).toBeGreaterThan(0);
      expect(skill.description.length).toBeGreaterThan(0);
      expect(skill.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("handleA2ARequest", () => {
  it("rejects a non-2.0 jsonrpc envelope", async () => {
    const res = await handleA2ARequest(
      { jsonrpc: "1.0", id: 1, method: "SendMessage" },
      deps,
    );
    expect(res.error?.code).toBe(-32600);
  });

  it("returns method-not-found for an unknown method", async () => {
    const res = await rpc("Nope");
    expect(res.error?.code).toBe(-32601);
  });

  it("returns invalid-params when SendMessage has no message", async () => {
    const res = await rpc("SendMessage", {});
    expect(res.error?.code).toBe(-32602);
  });

  it("answers SendMessage with an agent Message, echoing the request id", async () => {
    const res = await rpc("SendMessage", userMessage([{ text: "hello" }]), 7);

    expect(res.id).toBe(7);
    expect(res.error).toBeUndefined();
    expect(res.result?.message?.role).toBe("ROLE_AGENT");
    expect(res.result?.message?.messageId).toEqual(expect.any(String));
  });

  it("uses v1.0 member-based parts, never a kind discriminator", async () => {
    const res = await rpc("SendMessage", userMessage([{ text: "hello" }]));

    for (const part of res.result!.message!.parts) {
      expect(part).not.toHaveProperty("kind");
      expect("text" in part || "data" in part).toBe(true);
    }
  });

  it("routes a free-text message to a search over posts", async () => {
    const res = await rpc("SendMessage", userMessage([{ text: "hello" }]));
    const data = res.result!.message!.parts.find((p) => "data" in p);

    expect(JSON.stringify(data)).toContain("hello");
  });

  it("invokes a named skill when given a data part", async () => {
    const res = await rpc(
      "SendMessage",
      userMessage([{ data: { skill: "get_profile" } }]),
    );

    expect(JSON.stringify(res.result)).toContain("Nubelson Fernandes");
  });

  it("reports a miss for a slug that does not exist", async () => {
    const res = await rpc(
      "SendMessage",
      userMessage([{ data: { skill: "get_post", type: "blog", slug: "nope" } }]),
    );

    expect(JSON.stringify(res.result).toLowerCase()).toContain("no blog post");
  });

  it("returns invalid-params for a skill the card does not advertise", async () => {
    const res = await rpc(
      "SendMessage",
      userMessage([{ data: { skill: "delete_everything" } }]),
    );

    expect(res.error?.code).toBe(-32602);
  });

  it("reports task-not-found for GetTask, since it creates no tasks", async () => {
    const res = await rpc("GetTask", { id: "whatever" });
    expect(res.error?.code).toBe(-32001);
  });
});
