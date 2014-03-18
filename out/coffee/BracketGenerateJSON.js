(function() {
  module.exports = function(maxTime) {
    var current, ev, exponent, i, initialMatches, j, level, match, result, tree, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref, _ref1, _ref2;
    if (this.elimination === "single" && this.bestOf === 1) {
      exponent = Math.ceil(Math.log2(this.events.length));
      result = {
        allEvents: this.events,
        exponent: exponent
      };
      initialMatches = this.teams.reduce(function(acc, current) {
        if (acc.last().length === 2) {
          acc.push([current]);
        } else {
          acc.last().push(current);
        }
        return acc;
      }, [[]]).map(function(group) {
        return {
          slot1: {
            team: {
              name: group[0],
              wins: 0
            }
          },
          slot2: {
            team: {
              name: group[1],
              wins: 0
            }
          },
          winnerSlot: null
        };
      });
      tree = [];
      current = initialMatches;
      while (current.length > 1) {
        tree.push(current);
        current = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = current.length / 2 - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push({
              slot1: {
                team: null
              },
              slot2: {
                team: null
              }
            });
          }
          return _results;
        })();
      }
      tree.push(current);
      tree.push([
        {
          team: null
        }
      ]);
      for (i = _i = 0, _ref = tree.length - 3; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        for (j = _j = 0, _ref1 = tree[i].length - 1; _j <= _ref1; j = _j += 2) {
          tree[i][j].winnerSlot = tree[i + 1][j / 2].slot1;
          tree[i][j + 1].winnerSlot = tree[i + 1][j / 2].slot2;
        }
      }
      tree[tree.length - 2][0].winnerSlot = tree[tree.length - 1][0];
      _ref2 = this.events;
      for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
        ev = _ref2[_k];
        if (ev.timestamp.getTime() <= maxTime.getTime()) {
          for (_l = 0, _len1 = tree.length; _l < _len1; _l++) {
            level = tree[_l];
            for (_m = 0, _len2 = level.length; _m < _len2; _m++) {
              match = level[_m];
              if (!((match.slot1 != null) && (match.slot2 != null))) {
                continue;
              }
              if (match.slot1.team === null || match.slot2.team === null) {
                continue;
              }
              if (![match.slot1.team.name, match.slot2.team.name].containsAll(ev.winner, ev.loser)) {
                continue;
              }
              if (match.winnerSlot.team === null) {
                match.winnerSlot.team = {
                  name: ev.winner,
                  wins: 0
                };
              }
            }
          }
        }
      }
      return JSON.stringify(tree, null, 2);
    } else {
      return "what";
    }
  };

}).call(this);
