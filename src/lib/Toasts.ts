import { toast } from '@zerodevx/svelte-toast'

export const success = m => toast.push(m, {
  theme: {
    '--toastBackground': 'green',
    '--toastColor': 'white',
    '--toastBarBackground': 'olive'
  }
});

export const error = m => toast.push(m, { theme: {
  "--toastBackground": "#F56565",
  "--toastBarBackground": "#C53030",
}});

