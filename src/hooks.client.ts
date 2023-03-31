import { invoke } from '@tauri-apps/api';
import { error } from '$lib/toasts';

// Kick-off our device watcher
invoke('plugin:serial|watch_devices', {}).catch((err) => error(err));
