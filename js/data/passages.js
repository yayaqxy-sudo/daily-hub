// 口语练习段落 + 漫威/怪奇物语台词
// 每天一段，达到可以复述的程度
const PASSAGES = [
  // 日常话题段落
  { type: "passage", source: "Daily Practice", title: "晨间仪式",
    en: "I've developed a morning routine that sets the tone for my entire day. I wake up early, drink a glass of warm water, and spend fifteen minutes doing some light stretching. Then I sit down with a cup of coffee and plan out my priorities. It's nothing fancy, but this simple habit has completely transformed how I approach each day. I feel more grounded, more focused, and less reactive to whatever challenges come my way.",
    zh: "我养成了一个晨间习惯，为一整天定下基调。我会早起，喝一杯温水，花十五分钟做轻度拉伸。然后坐下来喝杯咖啡，规划当天的优先事项。这没什么花哨的，但这个简单的习惯彻底改变了我面对每一天的方式。我感觉更踏实、更专注，对遇到的挑战也不那么容易冲动应对了。" },

  { type: "passage", source: "Daily Practice", title: "关于压力",
    en: "Stress isn't always the enemy. In small doses, it can actually push us to perform better and grow stronger. The problem is when stress becomes chronic, when we never give ourselves a chance to recover. That's when it starts to affect our health, our relationships, and our judgment. The key is learning to recognize when you're crossing that line, and having the courage to step back when you need to.",
    zh: "压力并不总是敌人。适度的压力实际上能推动我们表现得更好、变得更强。问题在于当压力变成慢性的，当我们从不给自己恢复的机会时，它就开始影响我们的健康、人际关系和判断力。关键在于学会识别你何时越过了那条线，并在需要时有勇气退一步。" },

  { type: "passage", source: "Daily Practice", title: "城市的节奏",
    en: "There's something about living in a big city that both energizes and exhausts you. The pace is relentless, the noise is constant, and yet there's an undeniable vibrancy that pulls you in. You meet people from all walks of life, you stumble upon hidden cafes and bookshops, and every street has a story to tell. But you also learn the importance of carving out quiet moments for yourself, because the city will take everything you give it and still ask for more.",
    zh: "住在大城市有种东西既让你充满活力又让你疲惫。节奏是无情的，噪音是持续不断的，但又有一种不可否认的活力吸引着你。你会遇到各行各业的人，偶然发现隐秘的咖啡馆和书店，每条街都有一个故事。但你也学会了为自己留出安静时刻的重要性，因为城市会拿走你给的一切，然后还想要更多。" },

  { type: "passage", source: "Daily Practice", title: "关于阅读",
    en: "Reading has always been my way of escaping and expanding at the same time. When I open a book, I'm not just consuming words on a page. I'm stepping into someone else's perspective, walking through their thoughts, seeing the world through their eyes. And somehow, when I close the book and return to my own life, I find that my world has gotten a little bigger. That's the magic of reading.",
    zh: "阅读一直是我同时逃避和拓展的方式。打开一本书时，我不仅是在消费纸上的文字。我是在走进别人的视角，穿行于他们的思想中，透过他们的眼睛看世界。而当我合上书回到自己的生活时，我发现自己的世界变大了一些。这就是阅读的魔力。" },

  { type: "passage", source: "Daily Practice", title: "关于友谊",
    en: "The best friendships aren't the ones where you talk every day. They're the ones where you can pick up right where you left off, even after months apart. There's a comfort in knowing that distance doesn't diminish what you share. True friendship isn't about proximity. It's about the depth of understanding, the shared memories, and the unspoken promise that no matter what happens, you'll always have each other's back.",
    zh: "最好的友谊不是每天都聊天的那种。而是即使分开几个月，也能从上次的地方继续的那种。知道距离不会削弱你们之间的东西，这是一种安慰。真正的友谊不在于距离近不近，而在于理解的深度、共同的记忆，以及那份不需要说出口的承诺——无论发生什么，你们都会互相支持。" },

  // 漫威电影台词
  { type: "movie", source: "Marvel - Avengers: Endgame", title: "钢铁侠的告别",
    en: "I am Iron Man. I hope they remember you. Not as a hero, but as a man who did his best. We all do our best, and sometimes our best isn't enough. But that doesn't mean we shouldn't try. Because the thing about trying is, even if you fail, you learn something. And that knowledge, that growth, that's what makes us who we are.",
    zh: "我是钢铁侠。我希望他们记住你——不是作为英雄，而是作为一个尽了全力的人。我们都尽了全力，有时候尽全力也不够。但这不意味着我们不应该去尝试。因为尝试的意义在于，即使失败，你也会学到东西。而那份知识、那份成长，塑造了我们。" },

  { type: "movie", source: "Marvel - Spider-Man: Homecoming", title: "托尼·斯塔克的忠告",
    en: "If you're nothing without this suit, then you shouldn't have it. I wanted you to be better. I wanted you to be the kind of person who doesn't need a suit to make a difference. The suit doesn't make the hero. The hero makes the suit. Remember that. Because the world doesn't need another guy in a fancy costume. It needs someone who cares enough to do the right thing, even when it's hard.",
    zh: "如果你没有这身战衣就什么都不是，那你就不配拥有它。我希望你成为更好的人。我希望你成为不需要战衣也能改变世界的那种人。战衣不能造就英雄，英雄造就了战衣。记住这一点。因为世界不需要又一个穿着花哨服装的人，它需要的是即使困难也愿意做正确之事的人。" },

  { type: "movie", source: "Marvel - Black Panther", title: "特查拉的信念",
    en: "In times of crisis, the wise build bridges, while the foolish build barriers. We must find a way to look after one another, as if we were one single tribe. The world is changing. Soon, we will not be able to hide behind our walls. We must decide what kind of people we want to be. Not just for ourselves, but for the generations that will follow.",
    zh: "在危机时刻，智者架桥，愚者筑墙。我们必须找到彼此照顾的方式，就像我们是一个部落一样。世界在变化。很快，我们将无法再躲在墙后。我们必须决定自己想成为什么样的人——不仅为自己，也为了后代。" },

  { type: "movie", source: "Marvel - Captain America", title: "史蒂夫·罗杰斯的坚持",
    en: "I can do this all day. That's what people don't understand about persistence. It's not about being the strongest or the fastest. It's about refusing to give up, no matter how many times you get knocked down. Because the moment you stay down is the moment you lose. Not to your opponent, but to yourself. And I refuse to lose to myself.",
    zh: "我可以这样坚持一整天。这就是人们不理解坚持的地方。这不是关于最强或最快，而是关于无论被打倒多少次都拒绝放弃。因为当你躺在地上的那一刻，你就输了。不是输给对手，而是输给自己。而我拒绝输给自己。" },

  { type: "movie", source: "Marvel - Guardians of the Galaxy", title: "关于失去与珍惜",
    en: "We're all just trying to find our place in this universe. Some of us lost people we loved, and that loss, it changes us. It makes us harder, more guarded. But it also makes us appreciate what we still have. The people who are still here, the moments we still get to share. Because nothing lasts forever, and maybe that's what makes everything matter.",
    zh: "我们都只是在宇宙中寻找自己的位置。我们中有些人失去了爱的人，那种失去改变了我们。它让我们变得更坚硬、更有防备。但它也让我们更加珍惜还拥有的东西。还在身边的人，还能分享的时刻。因为没有什么能永远持续，也许正是这一点让一切都有意义。" },

  // 怪奇物语台词
  { type: "movie", source: "Stranger Things", title: "小十一的勇气",
    en: "Friends don't lie. That's what I learned. It sounds so simple, but it's the hardest thing to actually live by. Because sometimes we lie to protect people we care about. We think we're doing the right thing. But the truth always comes out eventually. And when it does, the lie hurts more than the truth ever would have. So be brave enough to be honest, even when it's scary.",
    zh: "朋友不会撒谎。这是我学到的。听起来很简单，但真正做到是最难的。因为有时候我们撒谎是为了保护在乎的人，我们以为自己在做对的事。但真相总会浮出水面，而当它出现时，谎言造成的伤害远比真相本身更大。所以要有足够的勇气去诚实，即使那很可怕。" },

  { type: "movie", source: "Stranger Things", title: "霍普的守护",
    en: "You can't protect people from the world. I know that now. But you can give them the tools to protect themselves. You can teach them to be brave, to think for themselves, to trust their instincts. And when the time comes, when they face something they can't handle alone, you hope that they'll know enough to reach out. Because nobody should have to fight their monsters alone.",
    zh: "你没法把人们从世界中保护起来。我现在明白了这一点。但你可以给他们保护自己的工具。你可以教他们勇敢、独立思考、相信直觉。当时候到了，当他们面对无法独自应对的事情时，你希望他们知道可以寻求帮助。因为没有人应该独自与自己的怪物战斗。" },

  { type: "movie", source: "Stranger Things", title: "关于恐惧",
    en: "Fear doesn't make you weak. It makes you human. The trick isn't to stop being afraid. It's to keep going even when you are. Bravery isn't the absence of fear. It's being terrified and doing the right thing anyway. That's what real courage looks like. Not some fearless hero charging into battle, but someone whose hands are shaking, who can barely breathe, and who takes one more step forward.",
    zh: "恐惧不会让你软弱，它让你成为人。诀窍不是停止害怕，而是在害怕时继续前行。勇敢不是没有恐惧，而是在恐惧中仍然做正确的事。那才是真正的勇气。不是某个无所畏惧的英雄冲向战场，而是一个双手颤抖、几乎无法呼吸的人，仍然向前迈出了一步。" },

  { type: "movie", source: "Stranger Things", title: "友谊的力量",
    en: "When everything falls apart, the people who show up are the ones who matter. Not the ones with the best advice or the perfect plan. Just the ones who are there. Standing beside you in the mess, not trying to fix it, just refusing to let you face it alone. That's what friendship really means. Not grand gestures, but quiet presence. Just being there, when being there is hard.",
    zh: "当一切分崩离析时，出现的人才是重要的人。不是那些有最好建议或完美计划的人，只是那些在场的人。陪你站在混乱中，不试图修复什么，只是拒绝让你独自面对。这才是友谊的真正含义。不是宏大的举动，而是安静的陪伴。当陪伴很困难时，依然在那里。" },

  // 更多日常练习段落
  { type: "passage", source: "Daily Practice", title: "关于改变",
    en: "People resist change because it's uncomfortable. But comfort is where growth goes to die. Every time you stay in your comfort zone, you're choosing safety over possibility. And while safety feels good in the moment, it slowly kills your potential. The trick isn't to chase discomfort for its own sake. It's to recognize when comfort has become a cage, and have the courage to open the door.",
    zh: "人们抗拒改变因为那不舒服。但舒适区是成长终结的地方。每次你待在舒适区，你都在选择安全而非可能性。虽然安全在当下感觉很好，但它慢慢扼杀你的潜力。诀窍不是为了不适而追求不适，而是识别舒适何时变成了牢笼，并有勇气打开那扇门。" },

  { type: "passage", source: "Daily Practice", title: "独处的艺术",
    en: "There's a difference between being alone and being lonely. Being alone can be restorative. It's a chance to hear your own thoughts, to reconnect with what matters to you, to recharge. But loneliness is a different beast. It's the feeling of disconnection, of not being seen. The art is learning to be comfortable in your own company, to find peace in solitude, so that being alone becomes a choice, not a sentence.",
    zh: "独处和孤独是不同的。独处可以是恢复性的。这是一个倾听自己想法、重新连接对你重要之事、充电的机会。但孤独是另一回事。那是一种断裂感、不被看见的感觉。关键在于学会在自己的陪伴下感到舒适，在独处中找到平静，让独处成为一种选择，而不是一种判决。" },

  { type: "passage", source: "Daily Practice", title: "关于时间",
    en: "Time is the one resource you can never get back. You can lose money and make it back. You can lose friends and find new ones. But time, once spent, is gone forever. And yet we spend it so carelessly, scrolling through feeds we don't remember, watching things we don't care about, waiting for moments that never come. What if we treated time the way we treat money? What if we invested it instead of spending it?",
    zh: "时间是你永远无法找回的资源。钱亏了可以赚回来，朋友失去了可以交新的。但时间一旦花掉就永远消失了。然而我们却如此随意地花费它——刷着记不住的信息流，看不在乎的内容，等着永远不会来的时刻。如果我们像对待金钱一样对待时间会怎样？如果我们投资它而不是花掉它会怎样？" },

  { type: "passage", source: "Daily Practice", title: "关于完美主义",
    en: "Perfectionism is just fear wearing a fancy dress. We tell ourselves we're holding out for perfection, but really we're just afraid to ship something imperfect. The truth is, nothing is ever perfect on the first try. Or the second. Or the tenth. Perfection is a direction, not a destination. The people who succeed aren't the ones who get it right the first time. They're the ones who keep showing up, flaws and all.",
    zh: "完美主义不过是恐惧穿了件漂亮的衣服。我们告诉自己是在追求完美，但实际上只是害怕做出不完美的东西。真相是，没有任何事第一次就能完美。第二次不行，第十次也不行。完美是一个方向，不是一个终点。成功的人不是第一次就做对的人，而是不断出现的人——带着缺陷和一切。" },

  { type: "passage", source: "Daily Practice", title: "关于感恩",
    en: "Gratitude isn't about pretending everything is great when it isn't. It's about noticing the small things that are easy to overlook. The warmth of sunlight on your skin. The sound of rain against the window. A text from someone you were thinking about. These moments don't make problems disappear, but they remind you that life is more than its difficulties. And sometimes, that reminder is enough to get you through.",
    zh: "感恩不是在一切不好的时候假装一切都好。它在于注意到那些容易被忽略的小事。阳光照在皮肤上的温暖。雨打在窗上的声音。你正在想的人发来的消息。这些时刻不会让问题消失，但它们提醒你，生活不止是困难。有时候，这个提醒就足够让你撑过去。" },

  { type: "passage", source: "Daily Practice", title: "关于失败",
    en: "I used to think failure was the opposite of success. Now I think it's part of success. Every failure teaches you something that success never could. It shows you where your blind spots are, where your assumptions were wrong, where you need to grow. The people I admire most aren't the ones who never failed. They're the ones who failed, learned, and came back stronger. Failure isn't the end of the story. It's the middle.",
    zh: "我以前认为失败是成功的反面。现在我认为它是成功的一部分。每次失败都会教你成功永远无法教你的东西。它告诉你盲点在哪里、假设哪里错了、哪里需要成长。我最敬佩的人不是从未失败的人，而是失败了、学到了、然后更强大地回来的人。失败不是故事的结局，而是中间。" },

  { type: "passage", source: "Daily Practice", title: "关于习惯",
    en: "Habits are the architecture of daily life. You don't rise to the level of your goals; you fall to the level of your systems. That's why small habits matter more than big intentions. Reading one page a day seems pointless until you realize it's 365 pages a year. Doing five push-ups seems trivial until it becomes a hundred a month. The key is consistency, not intensity. Show up every day, even if just a little.",
    zh: "习惯是日常生活的建筑。你不会达到目标的高度，而会降到系统的高度。这就是为什么小习惯比大意图更重要。每天读一页看起来毫无意义，直到你意识到那是一年365页。做五个俯卧撑看起来微不足道，直到它变成一个月一百个。关键在于一致性，不是强度。每天出现，哪怕只是一点点。" },

  { type: "passage", source: "Daily Practice", title: "关于自我对话",
    en: "Pay attention to how you talk to yourself. Would you speak to a friend the way you speak to yourself? If your inner voice is harsh, critical, and unforgiving, that's not motivation. That's sabotage. We think being hard on ourselves will push us to improve, but research shows the opposite. Self-compassion builds resilience. So next time you make a mistake, try talking to yourself the way you'd talk to someone you love.",
    zh: "注意你如何跟自己说话。你会用跟自己说话的方式对朋友说话吗？如果你内心的声音是严苛的、批判的、不宽容的，那不是激励，那是自我破坏。我们以为对自己严厉会推动我们进步，但研究表明恰恰相反。自我关怀才能建立韧性。所以下次犯错时，试着用对待你爱的人的方式跟自己说话。" },

  { type: "passage", source: "Daily Practice", title: "关于当下",
    en: "The present moment is the only place where life actually happens. The past is a memory. The future is an imagination. Right now, this breath, this heartbeat, this is it. We spend so much energy replaying what happened or rehearsing what might happen that we miss what is happening. The warmth of the cup in your hands. The sound of someone laughing. The feeling of being alive. This is it. Don't miss it.",
    zh: "当下是唯一真正发生生活的地方。过去是记忆，未来是想象。现在，这一口呼吸，这一次心跳，这就是一切。我们花那么多精力重播发生过的事或排练可能发生的事，以至于错过了正在发生的事。手中杯子的温暖，某人笑的声音，活着的感觉。就是现在。别错过它。" }
];

// 获取今日段落（基于日期循环）
function getTodayPassage() {
  const today = new Date();
  const seed = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  return PASSAGES[seed % PASSAGES.length];
}

if (typeof module !== 'undefined') module.exports = { PASSAGES, getTodayPassage };
