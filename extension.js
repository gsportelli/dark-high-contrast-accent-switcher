const vscode = require('vscode');

const PLAIN_ACCENTS = {
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
    focusBorder: "#00B2FF",
    notebookCellBorderColor: "#827717"
  },
  "Lime Green": {
    contrastBorder: "#AEEA00",
    sideBarBorder: "#AEEA00",
    focusBorder: "#FF3DAC",
    notebookCellBorderColor: "#558B2F"
  },
  "Cool Gray": {
    contrastBorder: "#90A4AE",
    sideBarBorder: "#90A4AE",
    focusBorder: "#FFC107",
    notebookCellBorderColor: "#37474F"
  }
};

const NEON_ACCENTS = {
  "Laser Lime": {
    contrastBorder: "#BFFF00",
    sideBarBorder: "#BFFF00",
    focusBorder: "#FF1EC8",
    notebookCellBorderColor: "#70FF00"
  },
  "Bubblegum Pink": {
    contrastBorder: "#FF4EC2",
    sideBarBorder: "#FF4EC2",
    focusBorder: "#00FFD5",
    notebookCellBorderColor: "#D600A0"
  },
  "Electric Blue": {
    contrastBorder: "#00FFFF",
    sideBarBorder: "#00FFFF",
    focusBorder: "#FFEA00",
    notebookCellBorderColor: "#0080FF"
  },
  "Tangerine Flash": {
    contrastBorder: "#FFA500",
    sideBarBorder: "#FFA500",
    focusBorder: "#00B2FF",
    notebookCellBorderColor: "#FF6A00"
  },
  "Cyber Grape": {
    contrastBorder: "#C724B1",
    sideBarBorder: "#C724B1",
    focusBorder: "#39FF14",
    notebookCellBorderColor: "#7A1C9E"
  },
  "Strobe Yellow": {
    contrastBorder: "#FFFF33",
    sideBarBorder: "#FFFF33",
    focusBorder: "#00F6FF",
    notebookCellBorderColor: "#CCCC00"
  },
  "Cyan Beam": {
    contrastBorder: "#00F0FF",
    sideBarBorder: "#00F0FF",
    focusBorder: "#FF1493",
    notebookCellBorderColor: "#0099CC"
  },
  "Hot Magenta": {
    contrastBorder: "#FF1EFF",
    sideBarBorder: "#FF1EFF",
    focusBorder: "#00FF87",
    notebookCellBorderColor: "#C600C6"
  },
  "Cyber Mint": {
    contrastBorder: "#3EFFDC",
    sideBarBorder: "#3EFFDC",
    focusBorder: "#FF9E00",
    notebookCellBorderColor: "#00CCAA"
  },
  "Laser Red": {
    contrastBorder: "#FF073A",
    sideBarBorder: "#FF073A",
    focusBorder: "#00FFFF",
    notebookCellBorderColor: "#C10029"
  }
};

const ACCENTS = {
  ...PLAIN_ACCENTS,
  ...NEON_ACCENTS
};

async function applyAccent(accent, configTarget) {
  const themeName = "Default High Contrast";
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

  const hasWorkspace = vscode.workspace.workspaceFile || vscode.workspace.workspaceFolders?.length > 0;
  const chooseAccent = vscode.commands.registerCommand(
    'darkHighContrastAccentSwitcher.chooseAccent',
    async () => {
      const config = vscode.workspace.getConfiguration();
      const originalGlobalColors = config.get('workbench.colorCustomizations', vscode.ConfigurationTarget.Global) || {};
      const originalWorkspaceColors = config.get('workbench.colorCustomizations', vscode.ConfigurationTarget.Workspace) || {};
      let previewTarget;
      if (hasWorkspace) {
        previewTarget = vscode.ConfigurationTarget.Workspace; // preview at workspace level if available
      } else {
        previewTarget = vscode.ConfigurationTarget.Global; // preview always at user level
      }

      const picker = vscode.window.createQuickPick();
      picker.items = Object.keys(ACCENTS).map(label => ({ label }));
      picker.placeholder = 'Scroll to preview. Press Enter to apply, Esc to cancel.';
      picker.canSelectMany = false;

      // Live preview
      picker.onDidChangeActive(async ([selected]) => {
        if (selected) {
          const accent = ACCENTS[selected.label];
          await applyAccent(accent, previewTarget);
        }
      });

      // Confirm + scope prompt
      picker.onDidAccept(async () => {
        const selection = picker.selectedItems[0];
        picker.hide();
        if (!selection) return;

        const scopePick = await vscode.window.showQuickPick(
          hasWorkspace ? ['Workspace', 'User'] : ['User'],
          {
            placeHolder: hasWorkspace
              ? 'Apply accent to:'
              : 'Only user-level settings are available (no workspace open)'
          }
        );

        if (!scopePick) {
          await config.update('workbench.colorCustomizations', originalGlobalColors, vscode.ConfigurationTarget.Global);
          if (hasWorkspace) await config.update('workbench.colorCustomizations', originalWorkspaceColors, vscode.ConfigurationTarget.Workspace);
          vscode.window.showInformationMessage(`Accent selection cancelled, original settings restored.`);
          return;
        };

        const configTarget = scopePick === 'Workspace'
          ? vscode.ConfigurationTarget.Workspace
          : vscode.ConfigurationTarget.Global;

        if (configTarget === vscode.ConfigurationTarget.Workspace) {
        await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Global);
        }

        await applyAccent(ACCENTS[selection.label], configTarget);

        vscode.window.showInformationMessage(
          `Applied "${selection.label}" accent to ${configTarget === vscode.ConfigurationTarget.Workspace ? 'workspace' : 'user'} settings.`
        );
      });

      // Cancel
      picker.onDidHide(async () => {
        if (!picker.selectedItems.length) {
          await config.update('workbench.colorCustomizations', originalGlobalColors, vscode.ConfigurationTarget.Global);
          if (hasWorkspace) await config.update('workbench.colorCustomizations', originalWorkspaceColors, vscode.ConfigurationTarget.Workspace);
          vscode.window.showInformationMessage(`Accent selection cancelled, original settings restored.`);
        }
        picker.dispose();
      });

      picker.show();
    }
  );

  const reset = vscode.commands.registerCommand(
    'darkHighContrastAccentSwitcher.resetAccent',
    async () => {
      const config = vscode.workspace.getConfiguration();

      const scope = await vscode.window.showQuickPick(
        hasWorkspace ? ['Workspace', 'User'] : ['User'],
        {
          placeHolder: hasWorkspace
            ? 'Apply accent to:'
            : 'Only user-level settings are available (no workspace open)'
        }
      );

      if (!scope) return;

      const configTarget = scope === 'Workspace'
        ? vscode.ConfigurationTarget.Workspace
        : vscode.ConfigurationTarget.Global;

      await config.update('workbench.colorCustomizations', {}, configTarget);
      await config.update('workbench.colorTheme', 'Default High Contrast', configTarget);

      vscode.window.showInformationMessage(
        `Reset accent and restored theme to Default High Contrast (${scope.toLowerCase()} scope).`
      );
    }
  );

  context.subscriptions.push(chooseAccent);
  context.subscriptions.push(reset);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
