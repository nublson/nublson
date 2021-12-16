export type BlogCategory = {
  id: string;
  name: string;
};

export type BlogItem = {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  publish_date: string;
  read_time: number;
  categories: BlogCategory[];
};

export type DatabaseResult = {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  cover: {
    type: "external" | "file";
    file: {
      url: string;
      expiry_time: string;
    };
    external: {
      url: string;
    };
  };
  icon: {
    type: string;
    emoji: string;
  };
  parent: {
    type: string;
    database_id: string;
  };
  archived: boolean;
  properties: {
    state: {
      id: string;
      type: string;
      select: {
        id: string;
        name: string;
        color: string;
      };
    };
    publish_date: {
      id: string;
      type: string;
      date: {
        start: string;
        end: string | null;
      };
    };
    description: {
      id: string;
      type: string;
      rich_text: [
        {
          type: string;
          text: {
            content: string;
            link: string | null;
          };
          annotations: {
            bold: boolean;
            italic: false;
            strikethrough: boolean;
            underline: boolean;
            code: boolean;
            color: string;
          };
          plain_text: string;
          href: string | null;
        }
      ];
    };
    Created: {
      id: string;
      type: string;
      created_time: string;
    };
    Name: {
      id: string;
      type: string;
      title: [
        {
          type: string;
          text: {
            content: string;
            link: string | null;
          };
          annotations: {
            bold: boolean;
            italic: boolean;
            strikethrough: boolean;
            underline: boolean;
            code: boolean;
            color: string;
          };
          plain_text: string;
          href: string | null;
        }
      ];
    };
  };
  url: string;
};

export type RichTextData = {
  annotations: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: "default" | string;
  };
  href: string | null;
  plain_text: string;
  text: {
    content: string;
    link: {
      url: string;
    } | null;
  };
  type: string;
};

export type RichTextProps = {
  id: string;
  type:
    | "paragraph"
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "bulleted_list_item"
    | "numbered_list_item"
    | "to_do"
    | "toggle"
    | "child_page"
    | "child_database"
    | "embed"
    | "image"
    | "video"
    | "file"
    | "pdf"
    | "bookmark"
    | "callout"
    | "quote"
    | "equation"
    | "divider"
    | "table_of_contents"
    | "column"
    | "column_list"
    | "link_preview"
    | "synced_block"
    | "template"
    | "link_to_page"
    | "unsupported";
};
