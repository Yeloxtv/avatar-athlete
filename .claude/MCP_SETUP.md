# Configuration MCP — Claude Code (dans Cursor)

## Contexte

Claude Code dans Cursor (extension VSCode) ne lit pas `settings.json` pour les MCP — il utilise uniquement `.mcp.json` à la racine du projet. Le `.claude/settings.json` sert à auto-approuver les serveurs via `enabledMcpjsonServers`.

---

## Fichiers concernés

| Fichier | Rôle |
|---|---|
| `.mcp.json` | Déclare les serveurs MCP (commande, args, env) |
| `.claude/settings.json` | Auto-approuve les serveurs au démarrage via `enabledMcpjsonServers` |

---

## Ajouter un nouveau MCP

### 1. Ajouter le serveur dans `.mcp.json`

```json
{
  "mcpServers": {
    "mon-serveur": {
      "command": "npx",
      "args": ["-y", "@mon-package/mcp@latest"],
      "env": {
        "MA_CLE": "valeur"
      }
    }
  }
}
```

### 2. L'approuver dans `.claude/settings.json`

```json
{
  "enabledMcpjsonServers": ["supabase", "playwright", "mon-serveur"]
}
```

### 3. Redémarrer Claude Code

Fermer et rouvrir la session Claude Code dans Cursor. Le package npx est téléchargé au premier démarrage.

---

## Serveurs configurés

### supabase
- Package : `@supabase/mcp-server-supabase@latest`
- Usage : requêtes SQL, migrations, logs, types TypeScript
- Requiert : `SUPABASE_ACCESS_TOKEN` + `--project-ref`

### playwright
- Package : `@playwright/mcp@latest`
- Usage : navigation browser, screenshots, interactions UI pour tests E2E
- Requiert : rien (headless par défaut)

---

## Piège à éviter

`mcpServers` n'est **pas** un champ valide de `settings.json` — le validateur de Claude Code rejettera le fichier entier si tu l'y mets. Tout va dans `.mcp.json`.
