import { stdin } from 'bun';
import { shouldSkipEditPath, writeSessionState } from './lib/session-state';

type AfterFileEditInput = {
	conversation_id?: string;
	file_path?: string;
};

async function main() {
	const payload = JSON.parse(await stdin.text()) as AfterFileEditInput;
	const conversationId = payload.conversation_id;
	const filePath = payload.file_path ?? '';

	if (!conversationId || shouldSkipEditPath(filePath)) {
		process.stdout.write('{}\n');
		return;
	}

	await writeSessionState(conversationId, { edited: true });
	process.stdout.write('{}\n');
}

main().catch((error) => {
	console.error('[ponytail-review mark-edit] failed', error);
	process.stdout.write('{}\n');
});
