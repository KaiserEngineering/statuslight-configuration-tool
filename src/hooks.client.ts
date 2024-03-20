import { invoke } from '@tauri-apps/api/core';
import { error } from '$lib/toasts';

// Kick-off our device watcher
invoke('watch_devices', {}).catch((err) => error(err));

invoke('drop_connection', {}).catch((err) => error(err));
