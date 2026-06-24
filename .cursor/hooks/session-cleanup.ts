import { stdin } from 'bun';
import { deleteSessionState } from './lib/session-state';

type SessionEndInput = {
	session_id?: string;
	conversation_id?: string;
};

async function main() {
	const payload = JSON.parse(await stdin.text()) as SessionEndInput;
	const conversationId = payload.conversation_id ?? payload.session_id;

	if (conversationId) {
		await deleteSessionState(conversationId);
	}

	process.stdout.write('{}\n');
}

main().catch((error) => {
	console.error('[ponytail-review session-cleanup] failed', error);
	process.stdout.write('{}\n');
});
