import * as vscode from 'vscode';

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "codeflux" is now active!');

	const helloWorldCommand = vscode.commands.registerCommand('codeflux.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from CodeFlux! how you doing');
	});
	context.subscriptions.push(helloWorldCommand);

	// Helper to send the current debug state to the webview
	const updateWebviewDebugStatus = () => {
		if (currentPanel) {
			const session = vscode.debug.activeDebugSession;
			currentPanel.webview.postMessage({
				command: 'updateDebugStatus',
				active: !!session,
				name: session ? session.name : '',
				type: session ? session.type : ''
			});
		}
	};

	// Listen for debug session start
	const onDidStartDebugSession = vscode.debug.onDidStartDebugSession(session => {
		updateWebviewDebugStatus();
	});
	context.subscriptions.push(onDidStartDebugSession);

	// Listen for debug session termination
	const onDidTerminateDebugSession = vscode.debug.onDidTerminateDebugSession(session => {
		updateWebviewDebugStatus();
	});
	context.subscriptions.push(onDidTerminateDebugSession);
    
	// Also handle when active debug session changes (e.g. switching between concurrent sessions)
	const onDidChangeActiveDebugSession = vscode.debug.onDidChangeActiveDebugSession(session => {
		updateWebviewDebugStatus();
	});
	context.subscriptions.push(onDidChangeActiveDebugSession);

	const openVisualizationCommand = vscode.commands.registerCommand('codeflux.openVisualization', () => {
		if (currentPanel) {
			// If we already have a panel, show it.
			currentPanel.reveal(vscode.ViewColumn.One);
			// Update status in case it changed while panel was hidden
			updateWebviewDebugStatus();
		} else {
			// Otherwise, create a new panel.
			currentPanel = vscode.window.createWebviewPanel(
				'codefluxVisualization',
				'CodeFlux Visualization',
				vscode.ViewColumn.One,
				{
					// Enable javascript in the webview
					enableScripts: true,
					// Restrict the webview to only loading content from our extension's `media` directory (none for now)
					localResourceRoots: []
				}
			);

			// Set the webview's initial html content
			currentPanel.webview.html = getWebviewContent();

			// Handle messages from the webview
			currentPanel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'testConnection':
							currentPanel?.webview.postMessage({ command: 'connectionSuccess' });
							return;
						case 'getInitialState':
							updateWebviewDebugStatus();
							return;
					}
				},
				undefined,
				context.subscriptions
			);

			// Listen for when the panel is disposed
			currentPanel.onDidDispose(
				() => {
					currentPanel = undefined;
				},
				null,
				context.subscriptions
			);
		}
	});
	context.subscriptions.push(openVisualizationCommand);
}

function getWebviewContent() {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
    <title>CodeFlux Visualization</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        h1, h2, h3 { color: var(--vscode-editor-foreground); }
        #status, #debugStatus { font-weight: bold; color: var(--vscode-notificationsWarningIcon-foreground); }
        .connected { color: var(--vscode-notificationsInfoIcon-foreground) !important; }
        button {
            margin-top: 15px;
            padding: 8px 16px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            cursor: pointer;
        }
        button:hover { background-color: var(--vscode-button-hoverBackground); }
        .debug-container {
            margin-top: 30px;
            padding: 15px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
        }
        .debug-details { margin-top: 10px; }
    </style>
</head>
<body>
    <h1>CodeFlux</h1>
    <h2>Visualization Workspace</h2>
    <p>Status: <span id="status">Disconnected</span></p>
    <button id="testBtn">Test Connection</button>

    <div class="debug-container">
        <h3>Debug Status: <span id="debugStatus">No Active Session</span></h3>
        <div id="debugDetails" class="debug-details" style="display: none;">
            <p>Session: <span id="debugSessionName"></span></p>
            <p>Type: <span id="debugSessionType"></span></p>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        // Request initial state as soon as the webview loads
        vscode.postMessage({ command: 'getInitialState' });
        
        document.getElementById('testBtn').addEventListener('click', () => {
            vscode.postMessage({ command: 'testConnection' });
        });

        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'connectionSuccess') {
                const statusEl = document.getElementById('status');
                statusEl.innerText = 'Extension Connected';
                statusEl.className = 'connected';
            } else if (message.command === 'updateDebugStatus') {
                const debugStatusEl = document.getElementById('debugStatus');
                const debugDetailsEl = document.getElementById('debugDetails');
                const nameEl = document.getElementById('debugSessionName');
                const typeEl = document.getElementById('debugSessionType');

                if (message.active) {
                    debugStatusEl.innerText = 'Active';
                    debugStatusEl.className = 'connected';
                    debugDetailsEl.style.display = 'block';
                    nameEl.innerText = message.name;
                    typeEl.innerText = message.type;
                } else {
                    debugStatusEl.innerText = 'No Active Session';
                    debugStatusEl.className = '';
                    debugDetailsEl.style.display = 'none';
                }
            }
        });
    </script>
</body>
</html>`;
}

export function deactivate() {}
