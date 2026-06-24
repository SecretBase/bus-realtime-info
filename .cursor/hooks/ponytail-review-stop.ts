import { stdin } from 'bun';
import { readSessionState, writeSessionState } from './lib/session-state';

type StopHookInput = {
	conversation_id?: string;
	status?: 'completed' | 'aborted' | 'error';
	loop_count?: number;
};

export const PONYTAIL_REVIEW_FOLLOWUP = `Run a ponytail-review on the feature changes you just built.

1. Read \`.agents/skills/ponytail-review/SKILL.md\`.
2. Review the diff with \`git diff\` and \`git diff --cached\` (branch + uncommitted changes).
3. List findings in the required one-line format: \`L<line>: <tag> <what>. <replacement>.\`
4. End with \`net: -<N> lines possible.\` or \`Lean already. Ship.\`
5. Review only — do not apply fixes unless I ask.
6. Summarize findings in a short table.`;

async function main() {
	const payload = JSON.parse(await stdin.text()) as StopHookInput;
	const conversationId = payload.conversation_id;

	if (!conversationId || payload.status !== 'completed') {
		process.stdout.write('{}\n');
		return;
	}

	const state = await readSessionState(conversationId);

	if (!state.edited || state.reviewRequested) {
		process.stdout.write('{}\n');
		return;
	}

	await writeSessionState(conversationId, { reviewRequested: true });
	process.stdout.write(JSON.stringify({ followup_message: PONYTAIL_REVIEW_FOLLOWUP }) + '\n');
}

main().catch((error) => {
	console.error('[ponytail-review stop] failed', error);
	process.stdout.write('{}\n');
});
