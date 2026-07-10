import { getConfig } from "./config.js";

const config = getConfig();

export const commands = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    aliases: [],
  },
  // entries
  {
    title: "Entries",
    url: "/admin/entries",
    aliases: ["entries", "content", "home"],
  },
  {
    title: "Entries:all",
    url: "/admin/entries?source=*",
    aliases: ["content"],
  },
  ...config.entries.sections.map((s) => ({
    title: `Entries:${s.name}`,
    url: `/admin/entries/${s.handle}`,
    aliases: ["content", `entries:${s.handle}`],
  })),

  // Globals
  {
    title: "Globals",
    url: "/admin/globals",
    aliases: ["globals", "content"],
  },
  ...config.globals.sets.map((s) => ({
    title: `Globals:${s.name}`,
    url: `/admin/globals/${s.handle}`,
    aliases: ["content", `globals:${s.handle}`],
  })),

  // Assets
  {
    title: "Assets",
    url: "/admin/assets",
    aliases: ["files", "fs", "directories"],
  },

  // Users
  {
    title: "Users",
    url: "/admin/users",
    aliases: [],
  },

  // Graphql
  {
    title: "GraphQL:Schemas",
    url: "/admin/graphql/schemas",
    aliases: ["gql:schemas"],
  },
  {
    title: "GraphQL:Tokens",
    url: "/admin/graphql/tokens",
    aliases: ["gql:tokens"],
  },
  {
    title: "GraphQL:GraphiQL",
    url: "/admin/graphiql",
    aliases: ["graphiql", "gql"],
  },

  // utilities
  {
    title: "utilities:Updates",
    url: "/admin/utilities/updates",
    aliases: ["upgrade"],
  },
  {
    title: "utilities:System Report",
    url: "/admin/utilities/system-report",
    aliases: [],
  },
  {
    title: "utilities:Project Config",
    url: "/admin/utilities/project-config",
    aliases: [],
  },
  {
    title: "utilities:PHP Info",
    url: "/admin/utilities/php-info",
    aliases: [],
  },
  {
    title: "utilities:Asset Indexes",
    url: "/admin/utilities/asset-indexes",
    aliases: [],
  },
  {
    title: "utilities:Queue Manager",
    url: "/admin/utilities/queue-manager",
    aliases: [],
  },
  {
    title: "utilities:Caches",
    url: "/admin/utilities/clear-caches",
    aliases: ["clear caches"],
  },
  {
    title: "utilities:Deprecation Warnings",
    url: "/admin/utilities/deprecation-errors",
    aliases: ["deprecation errors"],
  },
  {
    title: "utilities:Database Backup",
    url: "/admin/utilities/db-backup",
    aliases: ["db", "bu"],
  },
  {
    title: "utilities:Find and Replace",
    url: "/admin/utilities/find-replace",
    aliases: [],
  },
  {
    title: "utilities:Migrations",
    url: "/admin/utilities/migrations",
    aliases: [],
  },

  // Settings
  {
    title: "settings",
    url: "/admin/settings",
    aliases: [],
  },
  {
    title: "settings:General",
    url: "/admin/settings/general",
    aliases: ["system-name", "system-status", "timezone"],
  },
  {
    title: "settings:Sites",
    url: "/admin/settings/sites",
    aliases: ["system"],
  },
  {
    title: "settings:Users",
    url: "/admin/settings/users",
    aliases: ["system"],
  },
  {
    title: "settings:Addresses",
    url: "/admin/settings/addresses",
    aliases: ["system"],
  },
  {
    title: "settings:Email",
    url: "/admin/settings/email",
    aliases: ["system"],
  },
  {
    title: "settings:Plugins",
    url: "/admin/settings/plugins",
    aliases: ["system"],
  },
  {
    title: "settings:Sections",
    url: "/admin/settings/sections",
    aliases: ["content"],
  },
  ...config.entries.sections.map((s) => ({
    title: `settings:Sections:${s.name}:edit`,
    url: `/admin/settings/sections/${s.id}`,
    aliases: [`edit ${s.handle}`, `edit ${s.name}`],
  })),

  {
    title: "settings:Entry-Types",
    url: "/admin/settings/entry-types",
    aliases: ["content"],
  },
  {
    title: "settings:Fields",
    url: "/admin/settings/fields",
    aliases: ["content"],
  },
  {
    title: "settings:Globals",
    url: "/admin/settings/globals",
    aliases: ["content", "globalset"],
  },
  ...config.globals.sets.map((s) => ({
    title: `settings:Globals:${s.name}:edit`,
    url: `/admin/settings/globals/${s.id}`,
    aliases: [`edit ${s.handle}`, `edit ${s.name}`],
  })),
  {
    title: "settings:Sections:create",
    url: "/admin/settings/sections/new",
    aliases: ["new section"],
  },
  {
    title: "settings:Entry-Types:create",
    url: "/admin/settings/entry-types/new",
    aliases: ["new entry-type"],
  },
  {
    title: "settings:Fields:create",
    url: "/admin/settings/fields/new",
    aliases: ["new field"],
  },
  {
    title: "settings:Globals:create",
    url: "/admin/settings/globals/new",
    aliases: ["new globalset"],
  },
  // plugin store
  {
    title: "Plugin Store",
    url: "/admin/plugin-store",
    aliases: ["pluginstore"],
  },
];

export function filterCommands(query) {
  const q = query.toLowerCase().trim();
  if (!q) return commands;

  return commands.filter((cmd) => {
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.aliases.some((kw) => kw.includes(q))
    );
  });
}

export function runCommand(command, alt = false) {
  if ("url" in command) {
    if (alt) {
      window.open(command.url, "_blank");
      return;
    }
    navigation.navigate(command.url);
  }
}
