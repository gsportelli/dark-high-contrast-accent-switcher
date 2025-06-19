const vscode = require('vscode');

const ACCENTS = {
  "Emerald Green": {
    contrastBorder: "#00C853",
    sideBarBorder: "#00C853",
    focusBorder: "#FFD600",
    notebookCellBorderColor: "#2E7D32"
  },
  "Laser Lime": {
    contrastBorder: "#C6FF00",
    sideBarBorder: "#C6FF00",
    focusBorder: "#FF2BB5",
    notebookCellBorderColor: "#76FF03"
  },

  "Fuchsia Pink": {
    contrastBorder: "#EC407A",
    sideBarBorder: "#EC407A",
    focusBorder: "#00E5FF",
    notebookCellBorderColor: "#6A1B4D"
  },
  "Bubblegum Pink": {
    contrastBorder: "#FF5EDB",
    sideBarBorder: "#FF5EDB",
    focusBorder: "#00FFE0",
    notebookCellBorderColor: "#D81B60"
  },

  "Azure Blue": {
    contrastBorder: "#448AFF",
    sideBarBorder: "#448AFF",
    focusBorder: "#FF4081",
    notebookCellBorderColor: "#0D47A1"
  },
  "Electric Blue": {
    contrastBorder: "#00BFFF",
    sideBarBorder: "#00BFFF",
    focusBorder: "#FFF176",
    notebookCellBorderColor: "#1A74D4"
  },

  "Tangerine Orange": {
    contrastBorder: "#FF7043",
    sideBarBorder: "#FF7043",
    focusBorder: "#29B6F6",
    notebookCellBorderColor: "#E65100"
  },
  "Neon Tangerine": {
    contrastBorder: "#FF9900",
    sideBarBorder: "#FF9900",
    focusBorder: "#00CFFF",
    notebookCellBorderColor: "#FF6A00"
  },

  "Lavender Purple": {
    contrastBorder: "#B388FF",
    sideBarBorder: "#B388FF",
    focusBorder: "#64FFDA",
    notebookCellBorderColor: "#6A1B9A"
  },
  "Cyber Grape": {
    contrastBorder: "#C724B1",
    sideBarBorder: "#C724B1",
    focusBorder: "#CCFF00",
    notebookCellBorderColor: "#8E24AA"
  },

  "Golden Yellow": {
    contrastBorder: "#FDD835",
    sideBarBorder: "#FDD835",
    focusBorder: "#00BCD4",
    notebookCellBorderColor: "#F57F17"
  },
  "Strobe Yellow": {
    contrastBorder: "#FFFF33",
    sideBarBorder: "#FFFF33",
    focusBorder: "#00E8FF",
    notebookCellBorderColor: "#FFD600"
  },

  "Teal Blue": {
    contrastBorder: "#00ACC1",
    sideBarBorder: "#00ACC1",
    focusBorder: "#FF7043",
    notebookCellBorderColor: "#006064"
  },
  "Cyan Beam": {
    contrastBorder: "#00F7FF",
    sideBarBorder: "#00F7FF",
    focusBorder: "#FF3DAC",
    notebookCellBorderColor: "#00ACC1"
  },

  "Lime Green": {
    contrastBorder: "#AEEA00",
    sideBarBorder: "#AEEA00",
    focusBorder: "#FF3DAB",
    notebookCellBorderColor: "#7CB342"
  },
  "Cyber Mint": {
    contrastBorder: "#3EFFDC",
    sideBarBorder: "#3EFFDC",
    focusBorder: "#FFA000",
    notebookCellBorderColor: "#00CFAE"
  },

  "Crimson Red": {
    contrastBorder: "#8B0000", // much darker red
    sideBarBorder: "#8B0000",
    focusBorder: "#00E5FF",
    notebookCellBorderColor: "#5A0000"
  },
  "Laser Red": {
    contrastBorder: "#FF1A1A", // bright neon scarlet
    sideBarBorder: "#FF1A1A",
    focusBorder: "#00FFFF",
    notebookCellBorderColor: "#FF003C"
  },

  "Cool Gray": {
    contrastBorder: "#90A4AE",
    sideBarBorder: "#90A4AE",
    focusBorder: "#FFC107",
    notebookCellBorderColor: "#455A64"
  },
  "Hot Magenta": {
    contrastBorder: "#FF1EFF",
    sideBarBorder: "#FF1EFF",
    focusBorder: "#00FF87",
    notebookCellBorderColor: "#C600C6"
  }
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
        //   vscode.window.showInformationMessage(`Accent selection cancelled, original settings restored.`);
          return;
        };

        const configTarget = scopePick === 'Workspace'
          ? vscode.ConfigurationTarget.Workspace
          : vscode.ConfigurationTarget.Global;

        if (configTarget === vscode.ConfigurationTarget.Workspace) {
        await config.update('workbench.colorCustomizations', undefined, vscode.ConfigurationTarget.Global);
        }

        await applyAccent(ACCENTS[selection.label], configTarget);

        // vscode.window.showInformationMessage(
        //   `Applied "${selection.label}" accent to ${configTarget === vscode.ConfigurationTarget.Workspace ? 'workspace' : 'user'} settings.`
        // );
      });

      // Cancel
      picker.onDidHide(async () => {
        if (!picker.selectedItems.length) {
          await config.update('workbench.colorCustomizations', originalGlobalColors, vscode.ConfigurationTarget.Global);
          if (hasWorkspace) await config.update('workbench.colorCustomizations', originalWorkspaceColors, vscode.ConfigurationTarget.Workspace);
        //   vscode.window.showInformationMessage(`Accent selection cancelled, original settings restored.`);
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

    //   vscode.window.showInformationMessage(
    //     `Reset accent and restored theme to Default High Contrast (${scope.toLowerCase()} scope).`
    //   );
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
