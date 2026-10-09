# Storyboard — InboxPilot concept demo

1080 × 1350 (4:5) · 30 fps · 60 s · composition `ProductDemo`.
Times are absolute; in-scene event times live in `src/config/timing.ts`.
A small **"Concept demo • Sample data"** label sits top-left for the whole video.

| # | Time | Headline | What the viewer sees | Sound |
| --- | --- | --- | --- | --- |
| 1 | 0–6 s | **Great products. Too many messages.** | Headline masks in. Three tilted message cards pop in: Maya Torres (Messenger) "Is this available in medium?", Sam Okafor (WhatsApp) "How much is delivery?", Priya Nair (Instagram) "Can I place an order?". "New message" pings pile up; an unread counter bumps with each one. Headline and pings clear at ~5.5 s; the cards stay. | pop × 3, music in |
| 2 | 6–14 s | **Every conversation. One workspace.** | The three cards fly into an InboxPilot dashboard (list · conversation · customer panel) and become rows; the other rows slide in. Cursor clicks Jordan Lee's conversation → row highlights, thread and customer panel fill, AI typing dots appear. Camera zooms to the customer panel, which gets a teal outline. | click |
| 3 | 14–29 s | *(no headline — the interface is the story)* | Large phone, Instagram chat with Northline Apparel. Customer: "Do you have the navy hoodie in large?" → typing dots → assistant: "Yes—size L is available. It's $49." → product card (Navy Everyday Hoodie, Size L • In stock, $49) → "I'll take one." → typing → "Great. Where should we send it?" → address bubble collapses to **Delivery details received**. Floating notes: *Inventory check* (checking… → 6 in stock) and *Order draft* (1 × hoodie $49.00, delivery Waiting… → Added, "Draft — awaiting approval"). | pops, chime on collapse |
| 4 | 29–41 s | **From conversation to order.** / *You approve before it moves forward.* | Order card #NL-1042: Navy Everyday Hoodie, Size L, Qty 1, Item $49.00, Delivery $5.00, **Total $54.00**, status **Pending approval**. Cursor clicks **Approve order** → status **Approved**, button "Order approved", outline glow. No payment or shipping is shown. | click, chime |
| 5 | 41–50 s | **Automation, with you in control.** | Alex Kim (Messenger), badge "AI handling". Customer: "Can you make an exception to your return policy?" → amber banner **Needs your attention** with **Take over**. Cursor clicks → badge becomes **Human handling**, banner "Automated replies paused", AI-replies toggle switches off, composer becomes "Reply as Northline Apparel…". | pop, click |
| 6 | 50–56 s | **A clear view of every conversation.** | Count tiles derived from the data: Open 8, AI handling 7 → 6, Human handling 1 → 2, Orders approved 0 → 1. Changed tiles get a teal outline and ±1 chip. Channel bars: Instagram 3, WhatsApp 3, Messenger 2. | chime |
| 7 | 56–60 s | **More time for your business.** / *AI-assisted conversations. Human-controlled orders.* | InboxPilot wordmark, dashboard window + phone, footer "Product concept • Prototype demonstration". Calm hold; music fades out. | music fade |

## Consistency checks
- Totals come from `src/lib/orders.ts` (49.00 + 5.00 = 54.00).
- Scene-6 counts come from `src/lib/stats.ts`: the order approved in scene 4
  and the conversation taken over in scene 5 are the only changes.
