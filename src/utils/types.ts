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
  modified_date?: string;
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
