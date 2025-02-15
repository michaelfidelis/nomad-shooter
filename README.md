# Nomad Shooter

## Rodando o projeto

```bash
$ docker compose up

#or 

$ make up
```

## Rodando os testes

```bash
# unit tests
$ make test-unit

# e2e tests
$ make test-e2e
```
---

## Problema proposto
Dado o seguinte log de um jogo de tiro em primeira pessoa:
```
23/04/2019 15:34:22 - New match 11348965 has started
23/04/2019 15:36:04 - Roman killed Nick using M16
23/04/2019 15:36:33 - <WORLD> killed Nick by DROWN
23/04/2019 15:39:22 - Match 11348965 has ended

23/04/2021 16:14:22 - New match 11348966 has started
23/04/2021 16:26:04 - Roman killed Marcus using M16
23/04/2021 16:36:33 - <WORLD> killed Marcus by DROWN
23/04/2021 16:49:22 - Match 11348966 has ended

24/04/2020 16:14:22 - New match 11348961 has started
24/04/2020 16:26:12 - Roman killed Marcus using M16
24/04/2020 16:35:56 - Marcus killed Jhon using AK47
24/04/2020 17:12:34 - Roman killed Bryian using M16
24/04/2020 18:26:14 - Bryan killed Marcus using AK47
24/04/2020 19:36:33 - <WORLD> killed Marcus by DROWN
24/04/2020 20:19:22 - Match 11348961 has ended
```

### Resultado esperado
- Montar o ranking de cada partida, com a quantidade de frags* e a quantidade de mortes de cada jogador;
- Permitir que o seu código receba logs de múltiplas rodadas em um único arquivo.

### Observações
- Frag é quando um jogador mata outro player no jogo;
- Frags realizados pelo player WORLD devem ser desconsiderados;
- Permitir que uma rodada tenha múltiplos players, limitado a 20 jogadores por partida.

### Bônus
Faça caso se identifique com o problema ou se achar que há algo interessante a ser mostrado na solução:

- Descobrir a arma preferida (a que mais matou) do vencedor;
- Identificar a maior sequência de frags efetuadas por um jogador (streak) sem morrer, dentro da partida;
- Jogadores que vencerem uma partida sem morrerem devem ganhar um "award";
- Jogadores que matarem 5 vezes em 1 minuto devem ganhar um "award";
- Ranking Global dos jogadores, computando dados de todas as partidas existentes;
- Permitir que os jogadores sejam classificados em times, quando um jogador mata outro player do mesmo time - Friendly Fire - é computado -1 no score de frags do atirador.

### Solução
- Seja criativa;
- Explore ao máximo a orientação a objetos e engenharia de software (SOLID; UseCases; Services; Interactors, etc)
- Crie testes unitários e tente usar TDD;
- Faça commits atômicos e progressivos;
- Utilize Node com NestJS para fazer o upload do arquivo, persistir os dados das partidas e criar e as views necessárias para exibir o ranking, estatisticas dos jogadores e os dados das partidas.