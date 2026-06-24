import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';

export type SessionState = {
	edited: boolean;
	reviewRequested: boolean;
};

const STATE_DIR = '.cursor/hooks/state';

function statePath(conversationId: string): string {
	const safe = conversationId.replace(/[^a-zA-Z0-9_-]/g, '_');
	return path.join(STATE_DIR, `${safe}.json`);
}

export async function readSessionState(conversationId: string): Promise<SessionState> {
	try {
		const raw = await readFile(statePath(conversationId), 'utf8');
		return JSON.parse(raw) as SessionState;
	} catch {
		return { edited: false, reviewRequested: false };
	}
}

export async function writeSessionState(
	conversationId: string,
	patch: Partial<SessionState>
): Promise<SessionState> {
	const current = await readSessionState(conversationId);
	const next = { ...current, ...patch };
	await mkdir(STATE_DIR, { recursive: true });
	await writeFile(statePath(conversationId), JSON.stringify(next), 'utf8');
	return next;
}

export async function deleteSessionState(conversationId: string): Promise<void> {
	try {
		await unlink(statePath(conversationId));
	} catch {
		// already gone
	}
}

export function shouldSkipEditPath(filePath: string): boolean {
	const normalized = filePath.replace(/\\/g, '/');
	return (
		normalized.includes('/.cursor/hooks/state/') ||
		normalized.endsWith('/.cursor/hooks/state') ||
		normalized.includes('/node_modules/') ||
		normalized.includes('/.svelte-kit/')
	);
}
