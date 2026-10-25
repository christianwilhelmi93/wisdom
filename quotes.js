// 365 short quotes/maxims (public-domain quotes + concise paraphrased maxims), one per day
const QUOTES=[
[
"You have power over your mind — not outside events. Realize this, and you will find strength.",
"Marcus Aurelius"
],
[
"The impediment to action advances action. What stands in the way becomes the way.",
"Marcus Aurelius"
],
[
"Waste no more time arguing what a good man should be. Be one.",
"Marcus Aurelius"
],
[
"The happiness of your life depends upon the quality of your thoughts.",
"Marcus Aurelius"
],
[
"Very little is needed to make a happy life.",
"Marcus Aurelius"
],
[
"We suffer more often in imagination than in reality.",
"Seneca"
],
[
"Luck is what happens when preparation meets opportunity.",
"Seneca"
],
[
"While we are postponing, life speeds by.",
"Seneca"
],
[
"It is not that we have a short time to live, but that we waste a lot of it.",
"Seneca"
],
[
"Difficulties strengthen the mind, as labor does the body.",
"Seneca"
],
[
"No man is free who is not master of himself.",
"Epictetus"
],
[
"First say to yourself what you would be; and then do what you have to do.",
"Epictetus"
],
[
"It's not what happens to you, but how you react to it that matters.",
"Epictetus"
],
[
"Wealth consists not in having great possessions, but in having few wants.",
"Epictetus"
],
[
"Know thyself, and you will know the enemy.",
"after Sun Tzu"
],
[
"In the midst of chaos, there is also opportunity.",
"Sun Tzu"
],
[
"The supreme art of war is to subdue the enemy without fighting.",
"Sun Tzu"
],
[
"We are what we repeatedly do.",
"after Aristotle"
],
[
"Knowing yourself is the beginning of all wisdom.",
"Aristotle"
],
[
"Patience is bitter, but its fruit is sweet.",
"Aristotle"
],
[
"Well done is better than well said.",
"Benjamin Franklin"
],
[
"Lost time is never found again.",
"Benjamin Franklin"
],
[
"An investment in knowledge pays the best interest.",
"Benjamin Franklin"
],
[
"What good shall I do this day?",
"Benjamin Franklin"
],
[
"Do nothing which is of no use.",
"Miyamoto Musashi"
],
[
"Perceive that which cannot be seen with the eye.",
"Miyamoto Musashi"
],
[
"The two most powerful warriors are patience and time.",
"Leo Tolstoy"
],
[
"Everyone thinks of changing the world, but no one thinks of changing himself.",
"Leo Tolstoy"
],
[
"The most important time is now.",
"Leo Tolstoy"
],
[
"A journey of a thousand miles begins with a single step.",
"Lao Tzu"
],
[
"Nature does not hurry, yet everything is accomplished.",
"Lao Tzu"
],
[
"He who knows others is wise; he who knows himself is enlightened.",
"Lao Tzu"
],
[
"It does not matter how slowly you go as long as you do not stop.",
"Confucius"
],
[
"The unexamined life is not worth living.",
"Socrates"
],
[
"Simplify, simplify.",
"Henry David Thoreau"
],
[
"Go confidently in the direction of your dreams.",
"Henry David Thoreau"
],
[
"Trust thyself: every heart vibrates to that iron string.",
"Ralph Waldo Emerson"
],
[
"What lies behind us and what lies before us are tiny matters compared to what lies within us.",
"attributed to Emerson"
],
[
"My life has been full of terrible misfortunes, most of which never happened.",
"Michel de Montaigne"
],
[
"Gratitude is the parent of all the other virtues.",
"Cicero"
],
[
"Above all, don't lie to yourself.",
"Fyodor Dostoevsky"
],
[
"Even the darkest night will end and the sun will rise.",
"Victor Hugo"
],
[
"Do not spoil what you have by desiring what you have not.",
"Epicurus"
],
[
"The mind is everything. What you think you become.",
"attributed to the Buddha"
],
[
"For everything there is a season.",
"Ecclesiastes"
],
[
"Act as if what you do makes a difference. It does.",
"William James"
],
[
"Be not afraid of going slowly; be afraid only of standing still.",
"Chinese proverb"
],
[
"Begin at once to live, and count each separate day as a separate life.",
"Seneca"
],
[
"Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
"Marcus Aurelius"
],
[
"Between stimulus and response there is a space.",
"after Viktor Frankl"
],
[
"Eat simple food, sleep on a hard bed and endure cold sometimes: it strengthens body and soul.",
"Musonius Rufus"
],
[
"Look beneath the surface; let neither the quality nor value of anything escape you.",
"Marcus Aurelius"
],
[
"Don't split the difference.",
"Chris Voss"
],
[
"We become what we repeatedly do.",
"Aristotle"
],
[
"Definiteness of purpose is the starting point of achievement.",
"Napoleon Hill"
],
[
"The moving finger writes and moves on; nothing can cancel a line.",
"Omar Khayyam"
],
[
"First say to yourself what you would be; then do what you have to do.",
"Epictetus"
],
[
"Health is the greatest gift, contentment the greatest wealth.",
"Buddha"
],
[
"A business that depends on its owner is hard to sell.",
"John Warrillow"
],
[
"People live by love — not by worry for themselves.",
"Leo Tolstoy"
],
[
"To philosophise is to learn how to die.",
"Michel de Montaigne"
],
[
"Run a premortem: imagine the project failed and list why.",
"Daniel Kahneman"
],
[
"Your self-image sets the limits of your achievement; change it and you change your results.",
"Maxwell Maltz"
],
[
"Credit is money; pay debts punctually, and your reputation lets you borrow when needed.",
"Benjamin Franklin"
],
[
"The growing good of the world depends partly on unhistoric acts of quiet lives.",
"George Eliot"
],
[
"Fatigue and worry come from thinking about problems at the wrong time.",
"Bertrand Russell"
],
[
"When you are content to be simply yourself and don't compare or compete, everyone will respect you.",
"Lao Tzu"
],
[
"The unexamined life is not worth living,' said Socrates.",
"Plato"
],
[
"Wealth is what you don't see — the cars not bought.",
"Morgan Housel"
],
[
"When you see a worthy person, think of becoming equal to them.",
"Confucius"
],
[
"It is not so much our friends' help that helps us, as the confidence of their help.",
"Epicurus"
],
[
"People don't buy what you do; they buy why you do it.",
"Simon Sinek"
],
[
"Quantify everything: how many calls, quotes, wins.",
"Michael E. Gerber"
],
[
"Life is like riding a bicycle: to keep balance, keep moving.",
"Albert Einstein"
],
[
"Positioning happens in the customer's mind.",
"Al Ries & Jack Trout"
],
[
"Implication questions reveal the cost of the problem, making solutions valuable.",
"Neil Rackham"
],
[
"Make the essential easy: ask 'what if this could be easy?",
"Greg McKeown"
],
[
"Schedule thinking time: sit with one important question and a notepad, undisturbed.",
"Keith Cunningham"
],
[
"A friend is someone you can trust like yourself.",
"Seneca"
],
[
"Find your voice and inspire others to find theirs.",
"Stephen Covey"
],
[
"Simple: plans and orders must be simple and clear so everyone understands them.",
"Jocko Willink"
],
[
"Learning never exhausts the mind.",
"Leonardo da Vinci"
],
[
"Price is what you pay; value is what you get.",
"Warren Buffett"
],
[
"We must cultivate our garden: practical work beats idle speculation.",
"Voltaire"
],
[
"Follow conscience over unjust law.",
"Henry David Thoreau"
],
[
"Go into yourself; ask if you must create.",
"Rainer Maria Rilke"
],
[
"Build an emergency fund, then pay debts smallest to largest — the debt snowball.",
"Dave Ramsey"
],
[
"Comparison is the thief of joy.",
"Theodore Roosevelt"
],
[
"Whatever your hand finds to do, do it with all your might.",
"Ecclesiastes"
],
[
"Apply the 80/20 rule: 20% of your tasks produce 80% of results.",
"Brian Tracy"
],
[
"Discipline means delaying gratification, accepting responsibility, dedication to truth and balancing.",
"M. Scott Peck"
],
[
"When a man is tired of London, he is tired of life — stay curious about the world.",
"Samuel Johnson"
],
[
"Character is revealed more in small actions and words than in great battles.",
"Plutarch"
],
[
"Victorious warriors win first and then go to war; defeated warriors go to war first and then seek to win.",
"Sun Tzu"
],
[
"When delivering bad news to staff, be direct and honest.",
"Ben Horowitz"
],
[
"Gumption — enthusiasm — is the fuel; watch for gumption traps like impatience.",
"Robert Pirsig"
],
[
"Dereflection: stop overthinking yourself; turn attention outward.",
"Viktor Frankl"
],
[
"The first rule of business: don't make the problem worse.",
"Ryan Holiday"
],
[
"Shame thrives on secrecy; speaking it shrinks it.",
"Brené Brown"
],
[
"Do not be jealous; jealousy wastes energy.",
"Miyamoto Musashi"
],
[
"Differentiate: reward top performers, develop the middle and deal with low performers.",
"Jack Welch"
],
[
"It is better to be feared than loved if you cannot be both — but never be hated.",
"Niccolò Machiavelli"
],
[
"The opposite of a good idea can also be a good idea.",
"Rory Sutherland"
],
[
"Every offer carries perceived risk; reduce it with guarantees and proof.",
"Josh Kaufman"
],
[
"Friendship can only exist between good people.",
"Cicero"
],
[
"Winners quit fast and often — just not the right things.",
"Seth Godin"
],
[
"Americans form associations for everything; civic life strengthens freedom.",
"Alexis de Tocqueville"
],
[
"Visionary companies preserve a core ideology while stimulating progress in everything else.",
"Jim Collins"
],
[
"In the middle of life's journey, I found myself in a dark wood.",
"Dante"
],
[
"Hold a short daily huddle: what's up, key numbers, where you're stuck.",
"Verne Harnish"
],
[
"Ask 'five whys' to find the root cause of a problem, then fix the system.",
"Eric Ries"
],
[
"Resentment is like drinking poison and hoping it kills your enemies.",
"Nelson Mandela"
],
[
"Imagine an impartial spectator watching you; behave as they'd approve.",
"Adam Smith"
],
[
"Environment beats motivation.",
"James Clear"
],
[
"The investor's chief problem — and worst enemy — is likely to be himself.",
"Benjamin Graham"
],
[
"Work is love made visible.",
"Kahlil Gibran"
],
[
"Own your morning, elevate your life: the 20/20/20 formula — move, reflect, grow.",
"Robin Sharma"
],
[
"Humility is not thinking less of yourself but thinking of yourself less.",
"C.S. Lewis"
],
[
"Growing firms move through stages: early struggle, fun, whitewater, then predictable success.",
"Les McKeown"
],
[
"Get feedback before giving it: ask 'What could I do that would make it easier to work with me?",
"Kim Scott"
],
[
"Nothing comes from nothing; everything follows natural laws.",
"Lucretius"
],
[
"Brands grow by being easy to notice and easy to buy.",
"Byron Sharp"
],
[
"Happiness comes from solving problems, not avoiding them.",
"Mark Manson"
],
[
"Pay yourself first: keep at least a tenth of all you earn.",
"George S. Clason"
],
[
"Pigheaded discipline: master a few key skills through repetition rather than doing 4,000 things.",
"Chet Holmes"
],
[
"Automate your finances so saving and investing happen without willpower.",
"Ramit Sethi"
],
[
"Fear-setting: define your worst case, how to prevent and repair it, and the cost of inaction.",
"Tim Ferriss"
],
[
"One-on-ones are high-leverage: a short regular meeting where the report sets the agenda.",
"Andrew Grove"
],
[
"Write three good things each evening and why they happened.",
"Martin Seligman"
],
[
"Go to the ant, sluggard; consider her ways and be wise — work in summer, store for winter.",
"Proverbs"
],
[
"Concord makes small states great; discord ruins great ones.",
"Sallust"
],
[
"Time-block your most important work first thing, and protect it like an appointment.",
"Gary Keller"
],
[
"An hour lost at a bottleneck is an hour lost for the whole system.",
"Eliyahu Goldratt"
],
[
"The accountability mirror: face yourself honestly and set goals on sticky notes.",
"David Goggins"
],
[
"Small savings, steadily made, are the foundation of independence.",
"Samuel Smiles"
],
[
"Every company needs a Visionary and an Integrator who turns vision into execution.",
"Gino Wickman"
],
[
"The only way to win an argument is to avoid it.",
"Dale Carnegie"
],
[
"Each life stage has its task; in later life, generativity — caring for the next generation.",
"Erik Erikson"
],
[
"Customers 'hire' products to do a job.",
"Clayton Christensen"
],
[
"Job lost everything yet kept integrity; suffering is not always punishment.",
"Job"
],
[
"Most millionaires live below their means, drive used cars and budget carefully.",
"Thomas Stanley"
],
[
"Timing matters: most people peak in the morning for analytic work.",
"Daniel Pink"
],
[
"Eliminate, reduce, raise, create: redesign your offering to cut costs while raising value.",
"W. Chan Kim & Renée Mauborgne"
],
[
"I have not failed; I've found 10,000 ways that won't work.",
"Thomas Edison"
],
[
"Mind your own business: build your asset column while working your job.",
"Robert Kiyosaki"
],
[
"To err is human; to forgive, divine.",
"Alexander Pope"
],
[
"Make business a game with clear scores and rewards; people play harder.",
"Jack Stack"
],
[
"Build your house on rock, not sand — on lasting principles.",
"Matthew"
],
[
"Walk as if you are kissing the earth with your feet.",
"Thich Nhat Hanh"
],
[
"First keep peace within yourself; then you can bring peace to others.",
"Thomas à Kempis"
],
[
"Knowing is not enough; we must apply.",
"Goethe"
],
[
"Lean into the sharp points; discomfort is where growth happens.",
"Pema Chödrön"
],
[
"Catch people doing something right.",
"Ken Blanchard & Spencer Johnson"
],
[
"Watch the thinker: you are not your thoughts.",
"Eckhart Tolle"
],
[
"Fortune is a turning wheel.",
"Boethius"
],
[
"An object in possession seldom retains the charm it had in pursuit.",
"Pliny the Younger"
],
[
"Carpe diem: seize the day, trusting little in tomorrow.",
"Horace"
],
[
"Take profit first: Sales − Profit = Expenses.",
"Mike Michalowicz"
],
[
"You have a right to your actions, but not to their fruits.",
"Bhagavad Gita"
],
[
"Ahab's obsession destroyed him and his crew.",
"Herman Melville"
],
[
"Show me the incentive and I'll show you the outcome.",
"Charlie Munger"
],
[
"Generosity is giving more than you can; pride is taking less than you need.",
"Khalil Gibran"
],
[
"Act only by rules you could will to be universal laws.",
"Immanuel Kant"
],
[
"Stack bonuses that solve the next problems the customer will face.",
"Alex Hormozi"
],
[
"Use contexts: group tasks by where they can be done — @phone, @truck, @office.",
"David Allen"
],
[
"A sound mind in a sound body.",
"Juvenal"
],
[
"Be patient and tough; one day this pain will be useful to you.",
"Ovid"
],
[
"Train for the 'centenarian decathlon': fitness now determines what you can do at 90.",
"Peter Attia"
],
[
"Existence precedes essence: we create ourselves by our choices.",
"Jean-Paul Sartre"
],
[
"If I have seen further, it is by standing on the shoulders of giants.",
"Isaac Newton"
],
[
"Exceed customer expectations.",
"Sam Walton"
],
[
"Grit — passion and perseverance for long-term goals — predicts success more than talent.",
"Angela Duckworth"
],
[
"Empathy is built by listening and reading nonverbal cues.",
"Daniel Goleman"
],
[
"The wise man is not busy; leisure is an art of living.",
"Lin Yutang"
],
[
"A good reputation is more valuable than money.",
"Publilius Syrus"
],
[
"Haste in every business brings failure.",
"Herodotus"
],
[
"Key results must be measurable and verifiable; 'it's not a key result unless it has a number'.",
"John Doerr"
],
[
"Darkness cannot drive out darkness; only light can.",
"Martin Luther King Jr."
],
[
"It is only with the heart that one can see rightly; what is essential is invisible to the eye.",
"Antoine de Saint-Exupéry"
],
[
"Earth seen from afar is a pale blue dot; be kinder to one another.",
"Carl Sagan"
],
[
"Make the customer the hero and your business the guide.",
"Donald Miller"
],
[
"Keep your face always toward the sunshine — and shadows will fall behind you.",
"Walt Whitman"
],
[
"Ideal team players are humble, hungry and people-smart.",
"Patrick Lencioni"
],
[
"First impressions mislead; pride and prejudice blind us.",
"Jane Austen"
],
[
"Become who you are: develop your unique potential.",
"Friedrich Nietzsche"
],
[
"Avoid outshining the master.",
"Baltasar Gracián"
],
[
"Every gain has a cost, and every loss brings something.",
"Ralph Waldo Emerson"
],
[
"Scarcity: things seem more valuable when they are rare or disappearing.",
"Robert Cialdini"
],
[
"Life is either a daring adventure or nothing.",
"Helen Keller"
],
[
"Radical transparency: share honest feedback openly so the best ideas win.",
"Ray Dalio"
],
[
"Set targets ten times higher than you think and take ten times the action.",
"Grant Cardone"
],
[
"Talk straight, show respect, create transparency and keep commitments.",
"Stephen M. R. Covey"
],
[
"You can't cover the earth in leather, but you can wear sandals.",
"Shantideva"
],
[
"Introverts recharge alone; quiet strength is real strength.",
"Susan Cain"
],
[
"Rectitude, courage, benevolence, politeness, honesty, honour and loyalty form the samurai code.",
"Inazo Nitobe"
],
[
"The purpose of a business is to create a customer.",
"Peter Drucker"
],
[
"To whom much is given, much is required.",
"Luke"
],
[
"Lear learned too late to value honest love over flattery.",
"William Shakespeare"
],
[
"The first principle is that you must not fool yourself — and you are the easiest person to fool.",
"Richard Feynman"
],
[
"Hiring mistakes are costly; use a scorecard of outcomes before interviewing.",
"Geoff Smart & Randy Street"
],
[
"SAVERS: silence, affirmations, visualisation, exercise, reading, scribing.",
"Hal Elrod"
],
[
"Human beings are members of a whole; when one suffers, all feel it.",
"Saadi"
],
[
"People love to buy but hate being sold.",
"Jeffrey Gitomer"
],
[
"You are the average of the five people you spend most time with.",
"Jim Rohn"
],
[
"Alexander shared his soldiers' hardships — he poured out water rather than drink alone.",
"Arrian"
],
[
"Associate with men of good quality; it's better to be alone than in bad company.",
"George Washington"
],
[
"Gratitude keeps you connected to the source of good; be grateful.",
"Wallace Wattles"
],
[
"In the beginner's mind there are many possibilities; in the expert's few.",
"Shunryu Suzuki"
],
[
"Keep records of calls and results; numbers reveal what each call is worth.",
"Frank Bettger"
],
[
"Don't let the mind stop on anything; a mind that stops is caught.",
"Takuan Sōhō"
],
[
"I slept and dreamt life was joy; I woke and saw life was service; I acted and service was joy.",
"Rabindranath Tagore"
],
[
"The secret of happiness is freedom, and the secret of freedom is courage.",
"Thucydides"
],
[
"Build love maps: know your partner's world, worries and hopes.",
"John Gottman"
],
[
"Motivation doesn't last; neither does bathing — that's why we recommend it daily.",
"Zig Ziglar"
],
[
"The mind is like a garden: it will grow weeds if not cultivated.",
"James Allen"
],
[
"First principles: break problems down to basic truths and rebuild.",
"Shane Parrish"
],
[
"These are the times that try men's souls; the harder the conflict, the more glorious the triumph.",
"Thomas Paine"
],
[
"You can't stop the waves, but you can learn to surf.",
"Jon Kabat-Zinn"
],
[
"Lead me, Fate, where I must go; I'll follow willingly — or be dragged.",
"Cleanthes"
],
[
"People feel loved through words, time, gifts, service or touch.",
"Gary Chapman"
],
[
"Love is an art requiring knowledge, effort, discipline and patience, not just a feeling.",
"Erich Fromm"
],
[
"The world breaks everyone; afterwards many are strong at the broken places.",
"Ernest Hemingway"
],
[
"Reading makes a full man; conference a ready man; writing an exact man.",
"Francis Bacon"
],
[
"Perhaps one day it will please us to remember even these things.",
"Virgil"
],
[
"One must imagine Sisyphus happy: meaning comes from embracing the struggle.",
"Albert Camus"
],
[
"A man who dares to waste one hour has not discovered the value of life.",
"Charles Darwin"
],
[
"Early ideas are ugly babies; protect them while they mature.",
"Ed Catmull"
],
[
"Active love is harder than love in dreams.",
"Fyodor Dostoevsky"
],
[
"Character is a completely fashioned will.",
"Novalis"
],
[
"When stakes are high and emotions strong, make it safe to talk.",
"Kerry Patterson et al."
],
[
"Reverence for life: kindness to all living things.",
"Albert Schweitzer"
],
[
"Quitting at the right time is a skill.",
"Annie Duke"
],
[
"Change is the master key; rest the mind by using a different part of it.",
"Winston Churchill"
],
[
"Love believes all things yet is never deceived.",
"Søren Kierkegaard"
],
[
"Mastery requires an apprenticeship phase of deep, patient practice under good mentors.",
"Robert Greene"
],
[
"Replace ad-hoc messaging with clear processes; inbox chaos kills focus.",
"Cal Newport"
],
[
"Change happens; anticipate it, adapt quickly, and enjoy the new.",
"Spencer Johnson"
],
[
"Greet each day with love in your heart; it disarms resistance.",
"Og Mandino"
],
[
"Track everything you want to improve — money, time, habits.",
"Darren Hardy"
],
[
"The treasure is often found where you started, after the journey teaches you.",
"Paulo Coelho"
],
[
"Diogenes threw away his cup on seeing a child drink from his hands — owning less is freedom.",
"Diogenes"
],
[
"Treat employees as partners; their engagement shapes the customer experience.",
"Howard Schultz"
],
[
"Strategy is choosing what not to do.",
"Michael Porter"
],
[
"How wonderful it is that nobody need wait a single moment before starting to improve the world.",
"Anne Frank"
],
[
"Write angry letters but don't send them.",
"Abraham Lincoln"
],
[
"Twenty years from now you'll regret what you didn't do more than what you did.",
"Mark Twain"
],
[
"Some things gain from disorder.",
"Nassim Taleb"
],
[
"Man is only fully human when he plays.",
"Schiller"
],
[
"Every day is a journey, and the journey itself home.",
"Matsuo Bashō"
],
[
"Matters of great concern should be treated lightly; small matters seriously.",
"Yamamoto Tsunetomo"
],
[
"Be here now: presence is the gateway to peace.",
"Ram Dass"
],
[
"Not all who wander are lost.",
"J.R.R. Tolkien"
],
[
"The mind is a rider on an elephant: reason guides, but emotion has the power.",
"Jonathan Haidt"
],
[
"Too much sanity may be madness — and to see life as it is, not as it should be.",
"Cervantes"
],
[
"We become what we think about.",
"Earl Nightingale"
],
[
"Embrace constraints: limited time, money and people force creativity and focus.",
"Jason Fried & DHH"
],
[
"Pip learns that loyalty and humility matter more than social status.",
"Charles Dickens"
],
[
"Keep a regular sleep schedule, and a cool, dark bedroom.",
"Matthew Walker"
],
[
"A good job file includes scope, schedule, materials, risks and photos.",
"Michael Gerber"
],
[
"Always do your best — which varies by day.",
"Don Miguel Ruiz"
],
[
"Question every requirement, delete parts, simplify, accelerate, then automate.",
"Elon Musk biography (Isaacson)"
],
[
"He who knows only his own side of the case knows little of that.",
"John Stuart Mill"
],
[
"Each night, review the day: what did I do wrong, what right, what left undone?",
"Pythagoras"
],
[
"Growth mindset culture: be a learn-it-all, not a know-it-all.",
"Satya Nadella"
],
[
"The flowing river never stops, and yet the water never stays the same.",
"Kamo no Chōmei"
],
[
"Facts are stubborn things; wishes can't alter evidence.",
"John Adams"
],
[
"Beauty lies in impermanence; if things lasted forever they'd lose their poignancy.",
"Yoshida Kenkō"
],
[
"Love is patient and kind; it keeps no record of wrongs.",
"Corinthians"
],
[
"Most men use the first part of life to make the last part miserable.",
"La Bruyère"
],
[
"Compare yourself to who you were yesterday, not to others.",
"Jordan Peterson"
],
[
"Even after all this time, the sun never says to the earth 'You owe me.",
"Hafez"
],
[
"Bishop Myriel answered theft with mercy, and it transformed Jean Valjean's life.",
"Victor Hugo"
],
[
"All humanity's problems stem from our inability to sit quietly in a room alone.",
"Blaise Pascal"
],
[
"Happiness resides not in possessions but in the soul.",
"Democritus"
],
[
"Flow arises when challenge matches skill and attention is fully absorbed.",
"Mihaly Csikszentmihalyi"
],
[
"Wisdom cannot be taught; it must be lived and experienced.",
"Hermann Hesse"
],
[
"You get 24 fresh hours daily; spend the spare 90 minutes on improving your mind.",
"Arnold Bennett"
],
[
"I attribute my success to this: I never gave or took any excuse.",
"Florence Nightingale"
],
[
"The greatest discovery is that a person can alter their life by altering their attitudes.",
"William James"
],
[
"Penelope's patient weaving shows loyalty and cunning in waiting.",
"Homer"
],
[
"Augustine prayed 'give me chastity, but not yet' — we postpone virtue.",
"Augustine"
],
[
"The mind is its own place, and can make a heaven of hell or a hell of heaven.",
"John Milton"
],
[
"Who looks outside dreams; who looks inside awakes.",
"Carl Jung"
],
[
"The wound is the place where the light enters you.",
"Rumi"
],
[
"The curious paradox: when I accept myself as I am, then I can change.",
"Carl Rogers"
],
[
"Human nature is good, like water flowing downhill.",
"Mencius"
],
[
"Guilt and worry are useless emotions; they immobilise you in the present.",
"Wayne Dyer"
],
[
"We seldom think of what we have but always of what we lack.",
"Arthur Schopenhauer"
],
[
"If I am not for myself, who will be?",
"Talmud"
],
[
"Success is measured by obstacles overcome, not position reached.",
"Booker T. Washington"
],
[
"Tesla visualised machines fully in his mind before building them.",
"Nikola Tesla"
],
[
"Draw the circles of concern inward: treat strangers like cousins, cousins like siblings.",
"Hierocles"
],
[
"Call no man happy until he is dead; fortune can change.",
"Solon"
],
[
"Socrates said the less we need, the closer we are to the gods.",
"Socrates (via Xenophon)"
],
[
"Press on: nothing takes the place of persistence.",
"Ray Kroc"
],
[
"Wealth comes from control, entry barriers, need, time and scale — not from slow saving alone.",
"MJ DeMarco"
],
[
"Distraction is an escape from discomfort.",
"Nir Eyal"
],
[
"Trying to secure ourselves against life makes us anxious.",
"Alan Watts"
],
[
"Did I dream I was a butterfly, or am I a butterfly dreaming I'm a man?",
"Chuang Tzu"
],
[
"Cash flow can kill a growing company.",
"Phil Knight"
],
[
"Knowledge is the pathway from slavery to freedom.",
"Frederick Douglass"
],
[
"Believe in yourself; humble, reasonable confidence leads to success.",
"Norman Vincent Peale"
],
[
"Nurture leads with follow-up; most sales happen after multiple contacts.",
"Allan Dib"
],
[
"Be a philosopher, but amid all your philosophy, be still a man.",
"David Hume"
],
[
"The cave you fear to enter holds the treasure you seek.",
"Joseph Campbell"
],
[
"Chance favours the prepared mind.",
"Louis Pasteur"
],
[
"What a man can be, he must be — self-actualisation.",
"Abraham Maslow"
],
[
"Wabi-sabi: find beauty in the imperfect and simple.",
"Sen no Rikyū"
],
[
"No man is an island; we are all part of the main.",
"John Donne"
],
[
"Order and organisation make a household beautiful and efficient.",
"Xenophon"
],
[
"Distribution matters as much as product.",
"Peter Thiel"
],
[
"Self-interest speaks all languages and plays all roles, even disinterest.",
"La Rochefoucauld"
],
[
"Do not seek pleasure for its own sake; respect gods and Buddha without relying on them.",
"Musashi"
],
[
"Nothing in life is to be feared, only understood.",
"Marie Curie"
],
[
"Know your numbers: how much you need for security, independence and freedom.",
"Tony Robbins"
],
[
"Act as if it were impossible to fail.",
"Dorothea Brande"
],
[
"Freedom is realised by willing freedom for others too.",
"Simone de Beauvoir"
],
[
"Hire to buy back your time: delegate tasks below your hourly value.",
"Dan Martell"
],
[
"Write quickly and you'll never write well; write well and you'll soon write quickly.",
"Quintilian"
],
[
"Ask daily active questions: 'Did I do my best to…?' to measure effort, not outcomes.",
"Marshall Goldsmith"
],
[
"No man steps in the same river twice; everything flows.",
"Heraclitus"
],
[
"Know yourself, then think five moves ahead, like a chess master.",
"Patrick Bet-David"
],
[
"Teach us to number our days, that we may gain a heart of wisdom.",
"Psalms"
],
[
"Fortune favours the brave.",
"Livy"
],
[
"Growth isn't always better; staying small and profitable can be the goal.",
"Paul Jarvis"
],
[
"A growth mindset believes abilities can be developed.",
"Carol Dweck"
],
[
"They make a desert and call it peace.",
"Tacitus"
],
[
"Well-being is attained little by little, yet it is no little thing.",
"Zeno of Citium"
],
[
"Keystone habits, like exercise or planning, trigger widespread positive change.",
"Charles Duhigg"
],
[
"Ikigai lies where what you love, what you're good at, what the world needs and what pays meet.",
"Ikigai (García & Miralles)"
],
[
"Patience is bitter but its fruit sweet; children learn by experience, not lectures.",
"Jean-Jacques Rousseau"
],
[
"Teaism is the adoration of the beautiful among sordid daily facts.",
"Okakura Kakuzō"
],
[
"Happiness is when what you think, say and do are in harmony.",
"Mahatma Gandhi"
],
[
"Not all of us can do great things, but we can do small things with great love.",
"Mother Teresa"
],
[
"Philosophy must be practised more than studied; virtue is a matter of training.",
"Musonius Rufus"
],
[
"Do not act as if you had ten thousand years to live.",
"Marcus Aurelius"
],
[
"Tactical empathy: show you understand the other side's feelings and view.",
"Chris Voss"
],
[
"We trust people of good character more readily on almost every subject.",
"Aristotle"
],
[
"Desire backed by a definite plan and burning commitment turns into riches.",
"Napoleon Hill"
],
[
"Practise yourself in little things, and thence proceed to greater.",
"Epictetus"
],
[
"Better than a thousand hollow words is one word that brings peace.",
"Buddha"
],
[
"Specialise in one thing you do well and productise it with a fixed price.",
"John Warrillow"
],
[
"Natasha's joy in dancing shows the beauty of spontaneous life.",
"Leo Tolstoy"
],
[
"We must reserve a back room all our own, entirely free, for our true liberty.",
"Michel de Montaigne"
],
[
"Anchoring: the first number mentioned strongly influences negotiations.",
"Daniel Kahneman"
],
[
"Industry pays debts; despair increases them.",
"Benjamin Franklin"
],
[
"Zest — wide interests and friendly curiosity — is a key to happiness.",
"Bertrand Russell"
],
[
"Those who know don't speak; those who speak don't know.",
"Lao Tzu"
],
[
"Socrates was wise because he knew that he did not know.",
"Plato"
],
[
"Doing well with money is more about behaviour than intelligence.",
"Morgan Housel"
],
[
"Learning without thinking is useless; thinking without learning is dangerous.",
"Confucius"
],
[
"Pleasure is the absence of pain in the body and trouble in the soul — not luxury.",
"Epicurus"
],
[
"Great leaders create a circle of safety where people feel protected and trusted.",
"Simon Sinek"
],
[
"Systems run the business; people run the systems.",
"Michael E. Gerber"
],
[
"Strive not to be a success but to be of value.",
"Albert Einstein"
],
[
"The Law of Focus: owning a single word, like 'safety', is the most powerful marketing concept.",
"Al Ries & Jack Trout"
],
[
"Ask Situation, Problem, Implication and Need-payoff questions to uncover real needs.",
"Neil Rackham"
],
[
"If it's not a clear yes, it's a clear no.",
"Greg McKeown"
],
[
"Avoiding dumb mistakes beats chasing brilliant moves.",
"Keith Cunningham"
],
[
"Look at yourself in a mirror when angry; the ugliness may shame you into calm.",
"Seneca"
],
[
"Begin with the end in mind.",
"Stephen Covey"
],
[
"Discipline creates freedom: routines and rigour give you control over your time and options.",
"Jocko Willink"
],
[
"Simplicity is the ultimate sophistication.",
"Leonardo da Vinci"
],
[
"Look for businesses with a moat: a durable competitive advantage.",
"Warren Buffett"
],
[
"The best is the enemy of the good.",
"Voltaire"
]
];
