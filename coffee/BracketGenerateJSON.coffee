module.exports = (maxTime) ->
	if this.elimination == "single" and this.bestOf == 1
		exponent = Math.ceil (Math.log2 this.events.length)
		result =
			allEvents: this.events
			exponent: exponent

		initialMatches = this.teams
		.reduce (acc, current) -> #Group in sub-arrays of 2
				if acc.last().length == 2 
					acc.push([current]);
				else 
					acc.last().push(current);
				acc;
			, [[]]
		.map (group) -> #Map groups to smarter objects
				slot1:
					team:
						name: group[0]
						wins: 0
				slot2:
					team:
						name: group[1]
						wins: 0
				winnerSlot: null

		#Generate tree with empty matches
		tree = []
		current = initialMatches
		while current.length > 1 
			tree.push current
			current = for i in [0..current.length / 2 - 1]
				slot1:
					team: null
				slot2:
					team: null
		tree.push current
		tree.push [
			team: null
		]

		#Make the winner slots point to proper slots in the tree
		for i in [0..tree.length - 3]
			for j in [0..tree[i].length - 1] by 2
				tree[i][j].winnerSlot = tree[i + 1][j / 2].slot1
				tree[i][j + 1].winnerSlot = tree[i + 1][j / 2].slot2

		tree[tree.length - 2][0].winnerSlot = tree[tree.length - 1][0] #Point the winner of the finale to the winner slot

		for ev in this.events when ev.timestamp.getTime() <= maxTime.getTime()
			for level in tree
				for match in level
					#Find the match the event is about and set the winner
					unless match.slot1? and match.slot2?
						continue
					if match.slot1.team is null or match.slot2.team is null
						continue
					unless [match.slot1.team.name, match.slot2.team.name].containsAll ev.winner, ev.loser
						continue
					if match.winnerSlot.team is null
						match.winnerSlot.team =
							name: ev.winner
							wins: 0

		JSON.stringify tree, null, 2
	else
		"what"