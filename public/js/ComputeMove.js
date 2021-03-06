app.factory('ComputeMove', ['Constants', function (Constants) {

    ///////INFO AT http://codeandplay.date/public/api.html /////////////////////////

    var HEAL_LIMIT = 4;

    var allAttack = false;
    var lastTarget = -1;

    function nextMove(board, target) {

        var action = '';

        var iMobile = null;

        var ennemie = null;

        if (board.playerBoards[0].playerName === "iMOBILE") {
            iMobile = board.playerBoards[0];
            ennemie = board.playerBoards[1];
        } else {
            iMobile = board.playerBoards[1];
            ennemie = board.playerBoards[0];
        }

        for (var i = 0; i < 3; i++) {
            var fighter = iMobile.fighters[i];
            if (!fighter.isDead) {
                if (action.length !== 0) {
                    action += '$';
                }

                switch (fighter.fighterClass) {
                    case 'ORC':
                        if (allAttack) {
                            action += 'A' + fighter.orderNumberInTeam + ',' + Constants.MOVE_ATTACK + ',E' + lastTarget;
                        } else {
                            if (fighter.currentMana < 2) {
                                action += 'A' + fighter.orderNumberInTeam + ',' + Constants.MOVE_ATTACK + ',E' + target;
                            } else {
                                action += 'A' + fighter.orderNumberInTeam + ',' + Constants.ORC.special + ',E' + target;
                            }
                        }
                        break;
                    case 'CHAMAN':
                        if (allAttack) {
                            action += 'A' + fighter.orderNumberInTeam + ',' + Constants.MOVE_ATTACK + ',E' + lastTarget;
                        } else {
                            if (fighter.currentMana < 2) {
                                action += 'A' + fighter.orderNumberInTeam + ',' + Constants.MOVE_REST + ',A' + fighter.orderNumberInTeam;
                            } else {
                                // si autre en feu, move special
                                var playerInDanger = -1;
                                for (var j = 0; j < 3; j++) {
                                    if (!iMobile.fighters[j].isDead && iMobile.fighters[j].states !== null) {
                                        playerInDanger = j + 1;
                                        break;
                                    }
                                }
                                if (playerInDanger !== -1) {
                                    action += 'A' + fighter.orderNumberInTeam + ',' + Constants.CHAMAN.special + ',A' + playerInDanger;
                                } else {
                                    action += 'A' + fighter.orderNumberInTeam + ',' + Constants.MOVE_ATTACK + ',E' + target;
                                }
                            }
                        }
                        break;
                    case 'PRIEST':
                        if (allAttack) {
                            action += 'A' + fighter.orderNumberInTeam + ',' + Constants.MOVE_ATTACK + ',E' + lastTarget;
                        } else {
                            if (fighter.currentMana < 2) {
                                action += 'A' + fighter.orderNumberInTeam + ',' + Constants.MOVE_REST + ',A' + fighter.orderNumberInTeam;
                            } else {
                                // si autre a max pv -4, move special
                                var playerInDanger = -1;
                                for (var j = 0; j < 3; j++) {
                                    if (!iMobile.fighters[j].isDead && iMobile.fighters[j].currentLife < Constants[iMobile.fighters[j].fighterClass].pv - HEAL_LIMIT) {
                                        playerInDanger = j + 1;
                                        break;
                                    }
                                }
                                if (playerInDanger !== -1) {
                                    action += 'A' + fighter.orderNumberInTeam + ',' + Constants.PRIEST.special + ',A' + playerInDanger;
                                } else {
                                    action += 'A' + fighter.orderNumberInTeam + ',' + Constants.MOVE_ATTACK + ',E' + target;
                                }
                            }
                        }
                        break;
                }
            }
        }

        allAttack = false;
        if (action.indexOf(Constants.ORC.special) !== - 1) {
            allAttack = true;
            lastTarget = target;
        }

        return action;
    }

    return {
        getNetMove: nextMove

    }
}]);