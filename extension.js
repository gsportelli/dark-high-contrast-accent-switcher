const vscode = require('vscode');

const ACCENTS = {
  "Emerald Green": {
    contrastBorder: "#00C853",
    sideBarBorder: "#00C853",
    focusBorder: "#FFAB00",
    notebookCellBorderColor: "#33691E"
  },
  "Fuchsia Pink": {
    contrastBorder: "#EC407A",
    sideBarBorder: "#EC407A",
    focusBorder: "#00BFA5",
    notebookCellBorderColor: "#6A1B4D"
  },
  "Tangerine Orange": {
    contrastBorder: "#FF7043",
    sideBarBorder: "#FF7043",
    focusBorder: "#448AFF",
    notebookCellBorderColor: "#BF360C"
  },
  "Azure Blue": {
    contrastBorder: "#448AFF",
    sideBarBorder: "#448AFF",
    focusBorder: "#FF4081",
    notebookCellBorderColor: "#0D47A1"
  },
  "Lavender Purple": {
    contrastBorder: "#B388FF",
    sideBarBorder: "#B388FF",
    focusBorder: "#76FF03",
    notebookCellBorderColor: "#4A148C"
  },
  "Crimson Red": {
    contrastBorder: "#E53935",
    sideBarBorder: "#E53935",
    focusBorder: "#00E5FF",
    notebookCellBorderColor: "#B71C1C"
  },
  "Teal Blue": {
    contrastBorder: "#00ACC1",
    sideBarBorder: "#00ACC1",
    focusBorder: "#FF7043",
    notebookCellBorderColor: "#004D40"
  },
  "Golden Yellow": {
    contrastBorder: "#FDD835",
    sideBarBorder: "#FDD835",
    focusBorder: "#6A1B9A",
    notebookCellBorderColor: "#827717"
  },
  "Lime Green": {
    contrastBorder: "#AEEA00",
    sideBarBorder: "#AEEA00",
    focusBorder: "#7C4DFF",
    notebookCellBorderColor: "#558B2F"
  },
  "Cool Gray": {
    contrastBorder: "#90A4AE",
    sideBarBorder: "#90A4AE",
    focusBorder: "#FFC107",
    notebookCellBorderColor: "#37474F"
  }
};

async function applyAccent(accent, configTarget) {
  const themeName = "Default High Contrast Dark";
  await vscode.workspace.getConfiguration().update(
    'workbench.colorTheme',
    themeName,
    configTarget
  );

  await vscode.workspace.getConfiguration().update(
    'workbench.colorCustomizations',
    {
      "contrastBorder": accent.contrastBorder,
      "sideBar.border": accent.sideBarBorder,
      "focusBorder": accent.focusBorder,
      "notebook.cellBorderColor": accent.notebookCellBorderColor
    },
    configTarget
  );
}

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    'darkHighContrastAccentSwitcher.chooseAccent',
    async () => {
      const pick = await vscode.window.showQuickPick(Object.keys(ACCENTS), {
        placeHolder: 'Select an accent color'
      });

      if (!pick) return;

      const scope = await vscode.window.showQuickPick(
        ['Workspace', 'User'],
        { placeHolder: 'Apply accent to:' }
      );

      if (!scope) return;

      const configTarget = scope === 'Workspace'
        ? vscode.ConfigurationTarget.Workspace
        : vscode.ConfigurationTarget.Global;

      await applyAccent(ACCENTS[pick], configTarget);

      vscode.window.showInformationMessage(
        `Applied "${pick}" accent to ${scope.toLowerCase()} settings and set theme to Dark High Contrast.`
      );
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
