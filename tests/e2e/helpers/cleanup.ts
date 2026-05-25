import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function getTestUserId(email: string): Promise<string | null> {
  const { data } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()
  return data?.id ?? null
}

export async function cleanupTestData(email: string) {
  // Find user via auth admin
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users?.users?.find(u => u.email === email)
  if (!user) return

  const userId = user.id

  // Delete workout_sessions (cascades exercise_logs via FK)
  await supabase
    .from('workout_sessions')
    .delete()
    .eq('user_id', userId)

  // Get all campaigns owned by user
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id')
    .eq('owner_user_id', userId)

  if (campaigns?.length) {
    const campaignIds = campaigns.map(c => c.id)

    // Get all quests in those campaigns
    const { data: quests } = await supabase
      .from('quests')
      .select('id')
      .in('campaign_id', campaignIds)

    if (quests?.length) {
      const questIds = quests.map(q => q.id)

      // Delete quest_exercises
      await supabase
        .from('quest_exercises')
        .delete()
        .in('quest_id', questIds)

      // Delete user_quests
      await supabase
        .from('user_quests')
        .delete()
        .in('quest_id', questIds)

      // Delete quests
      await supabase
        .from('quests')
        .delete()
        .in('id', questIds)
    }

    // Delete campaigns
    await supabase
      .from('campaigns')
      .delete()
      .in('id', campaignIds)
  }
}
