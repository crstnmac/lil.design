import { Client } from '../services'

export function getScrollFeedInteractions(client: Client) {
  return client.from('interactions')
    .select(`
          *,
          interactionUser:profiles ( * )
        `)
    .order('created_at', { ascending: false })
}