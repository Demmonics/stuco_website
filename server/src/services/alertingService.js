/**
 * Alerting Service
 * Dispatches real-time webhooks (Discord, Slack, or generic webhook) when critical assets are mutated.
 */
export async function sendSecurityAlert({ event, details, user, ipAddress }) {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;

  const timestamp = new Date().toISOString();
  const alertPayload = {
    content: `🚨 **SECURITY ALERT: ${event}**\n**Time:** ${timestamp}\n**User:** ${user?.email || 'Unknown'} (${user?.role || 'No role'})\n**IP Address:** ${ipAddress}\n**Details:**\n\`\`\`json\n${JSON.stringify(details, null, 2)}\n\`\`\``,
    embeds: [
      {
        title: `Security Notice: ${event}`,
        color: 15158332, // Red
        fields: [
          { name: 'Initiator', value: `${user?.email || 'N/A'} (UID: ${user?.id || 'N/A'})`, inline: true },
          { name: 'Role', value: user?.role || 'unknown', inline: true },
          { name: 'Client IP', value: ipAddress || 'Unknown', inline: true },
          { name: 'Old Value', value: details.oldValue ? String(details.oldValue).substring(0, 200) : 'None' },
          { name: 'New Value', value: details.newValue ? String(details.newValue).substring(0, 200) : 'None' },
        ],
        timestamp,
      },
    ],
  };

  // Always log locally to console
  console.warn(`🚨 [SECURITY ALERT] ${event}:`, {
    user: user?.email,
    role: user?.role,
    ipAddress,
    details,
  });

  if (!webhookUrl || webhookUrl.includes('your/webhook/url')) {
    // No webhook configured, console warning suffices
    return false;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertPayload),
    });

    if (!res.ok) {
      console.error(`❌ [Alerting] Failed to dispatch webhook. HTTP ${res.status}`);
      return false;
    }
    console.log('✅ [Alerting] Security webhook dispatched successfully.');
    return true;
  } catch (err) {
    console.error('❌ [Alerting] Webhook delivery failed:', err.message);
    return false;
  }
}
