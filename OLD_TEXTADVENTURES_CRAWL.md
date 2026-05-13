# Old Text Adventures Crawl Notes

Source game: `Well Hello`
Game id: `bcr7e6fdlkeewud5amsrva`

This file records the partial crawl of the original Text Adventures prototype so it can inform CYODA without needing the old player session to stay live. The temporary play token is intentionally not stored here.

## Crawl Status

- Crawl type: rendered playthrough of the Text Adventures web player.
- Setup answers used: player name `Alex`, friend name `Jill`.
- Initial result: 80 rendered nodes reached before the player began timing out.
- Follow-up result: the unfinished O'Donoghues route was completed with a fresh token.
- Remaining: no known unfinished path in the main successful O'Donoghues route; the table route still appears unfinished or inaccessible.
- Caveat: extracted command-link text sometimes lost `s` characters in the automation output, so obvious labels have been normalized in these notes.
- Caveat: some old branches appear unfinished or buggy, especially the table route and some later duplicated choices.

## Opening Premise

The visitor is on holiday from responsibilities, visiting a friend in Aberdeen after the pandemic. They have been out for dinner and drinks, then get caught in a rain shower on Union Street.

They hear music from a pub, one of their favourites, and choose what to do.

Initial choices:

- `go inside` -> enters the pub.
- `go to the taxi rank and wait in the rain` -> returns cold and damp to Jill's home; adventure ends.

## Pub Entry

Choosing `go inside` sends the player down the steps into the bar.

Atmosphere:

- Not too busy.
- Regulars at the bar.
- Empty tables.
- Two staff members: one serving drinks, one polishing cutlery.
- Music is loud enough to enjoy but quiet enough for conversation.

Choices:

- `take a stool at the bar`
- `take a table`

## Stool At The Bar Route

The player and friend sit at the bar and order drinks. Mike enters, greets the regulars and bar staff, and is clearly a regular. A staff member pours him a pint.

Jill takes a phone call and goes outside.

The regulars discuss Boris Johnson and the pandemic. Stevie asks what the player thinks.

Choices:

- `I think everyone should leave poor Boris alone, he's just doing his best.`
- `Only Trump and Bolsonaro did worse. He should be ashamed of his "Superman of Capitalism" speech.`
- `I don't really know, I avoid politics when I can.`

Outcomes:

- Pro-Boris answer -> poor social fit; player is pushed toward finishing drinks and leaving.
- Anti-Boris answer -> Stevie and Mike approve; Mike asks the player's name and invites them to join the regulars.
- Avoid-politics answer -> softer/awkward route; can take drinks back to the table or hang around and wait for Jill.

## Join Regulars Route

After the more compatible politics route, Mike asks what brings the player in. The player explains they have been out with Jill for dinner and drinks. Mike says he kind of knows Jill and asks whether the player wants to join them while waiting.

Choices:

- `Sure`
- `No thanks, I'll just take these drinks and wait over there.`

If the player joins or later returns to join, the conversation moves into a religion compatibility question.

Religion choices:

- `Yes, devoutly`
- `Nope, atheist.`
- `Not really, I was brought up with one but don't practice anymore.`

Observed outcomes:

- `Yes, devoutly` appears to end or fail the route.
- `Nope, atheist` continues.
- `Not really...` continues.

## Humour Route

After the religion question, the regulars make bad jokes.

Choices:

- `"Oh ha ha very good," you say.`
- `You join in laughing with the bad jokes and tell one of your own.`

Observed outcomes:

- Dismissing the joke can lead toward getting a taxi home.
- Joining in can lead to an invite to another bar.

## O'Donoghues Route

After joining in with the humour, the player may be invited to continue to O'Donoghues with Mike and the bar staff, Victoria and Sarah.

Choices:

- `maybe for a bit`
- `No thanks, I'm going back to wait for Jill at home.`

If the player goes along, Mike leaves briefly and Sarah tells the player, smiling, that she thinks Mike might like them. Victoria agrees. They ask whether the player wants to join them for pool and darts.

When Mike returns and sees the player is still there, he looks pleased. Sarah and Victoria go ahead to get a table, and Mike walks with the player toward O'Donoghues.

Outside, the rain has stopped and the air feels fresh and crisp. Mike positions himself between the player and the wind, with his hands in his jacket pockets, subtly offering an arm without saying it outright.

Choices:

- `[slip your arm through his and into your coat pocket] "That wind bites doesn't it!"`
- `[pull your own coat tighter] "That wind has come up a bit hasn't it?"`

Observed outcomes:

- Taking his arm makes Mike smile, boosts his confidence, and makes the flirtation clearer. When the player slips crossing the cobbles, holding his arm prevents a fall.
- Keeping separate is lower-pressure. The player still walks with him, but slips crossing the cobbles and catches themself.

Both branches lead to O'Donoghues:

- Sarah and Victoria arrive.
- The group chats, plays pool, and plays darts.
- Later, Mike steps away again.
- Sarah says Mike is not going to make a move, so if the player is interested they will need to make it clear.

Choices:

- `You ask Mike if he'd mind walking you home.`
- `You ask the girls if they'd mind walking you to a taxi back to Jill's home.`

If the player asks Sarah and Victoria for help getting a taxi, all three walk to the taxi rank. The rain is back. Sarah and Victoria leave the player in the queue and say goodnight. The player gets a taxi and reaches the cold/damp ending.

If the player asks Mike to walk them home, he agrees and offers his arm. On the walk home, the clouds have cleared and the night is crisp. Mike admits that, if his terrible flirting style has not made it clear, he thinks the player is pretty nice. He asks to give the player his number so they can meet again.

Mike steps into an alcove out of the wind, takes the player's number, rings it, and then hesitates while they stand close together.

He says he was thinking how great it would be to kiss the player just now.

Final choices:

- `[You step closer and look up] "Really?"`
- `[You smile, step back out of the alcove and take his arm again] "Maybe next time..."`

Observed endings:

- `Really?` -> Mike gently leans in and kisses the player. The kiss starts soft but firm, becomes more passionate, and is interrupted by a passerby shouting `Get a room!`. Mike gets the player home safely; they arrive warm and flustered. He asks whether they fancy doing that again soon. Final line: `What happens next is up to you!`
- `Maybe next time...` -> the player and Mike keep chatting on the way home. He says goodnight, says he hopes to hear from the player soon, and waves from a distance as the player enters Jill's building. Final line: `What happens next is up to you!`

## Table Route

Choosing `take a table` starts a separate route:

- The friend and player take a table.
- The staff member brings a menu and mentions last orders for the kitchen.
- Mike enters and sits at the bar.
- The friend takes a phone call and goes outside.

Known issue:

- The rendered text included `{Player.pal}`, suggesting an unfinished variable interpolation in the original game.
- No usable next choices were captured from this route in the partial crawl.

## Endings Captured

Taxi/rain ending:

- The player arrives cold and damp at Jill's home.
- Text: `Your adventure is at an end.`
- Restart link: `Arrange another visit`

Poor social fit endings:

- Pro-Boris route can lead to finishing drinks and leaving.
- Some joke-dismissal or "go home" routes lead back to the taxi/rain ending.

Possible successful route:

- Anti-Boris or politics-compatible route.
- Join regulars.
- Non-devout religion answer.
- Join in with bad jokes.
- Accept O'Donoghues invite.
- Choose whether to take Mike's arm.
- Ask Mike to walk the player home.
- Exchange numbers.
- Either kiss him in the alcove or defer the kiss with `Maybe next time...`.
- Both romantic endings close with `What happens next is up to you!`

Recovered romantic endings:

- Kiss ending: warm, flustered, explicitly mutual, with a possible next date.
- Deferred-kiss ending: warm, respectful, still hopeful, with Mike saying he hopes to hear from the player soon.

Late taxi ending:

- If the player asks Sarah and Victoria to walk them to a taxi instead of asking Mike to walk them home, the rain returns and the route ends at Jill's home with `Your adventure is at an end.`

## Useful Ideas To Reuse In CYODA

- The rain-on-Union-Street opening fits the desired pub-conversation atmosphere.
- The old prototype already frames compatibility through conversational forks rather than visible scoring.
- The strongest route seems to be: shared politics, joining the table/bar group, humour fit, and a gentle body-language choice.
- The finished route works best when it stays low-pressure: Mike does not force the moment, Sarah gives the player a nudge, and the player chooses whether to escalate or keep it for next time.
- The new CYODA version should probably avoid visible "right answers" and make each branch feel like a natural conversational consequence.
- The table route could be rewritten or dropped unless it gets a stronger purpose.
- The old political references may date the story; they can be softened into values, conversational style, curiosity, and humour questions.
