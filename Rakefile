require 'rake'
require 'yaml'
require 'digest'

COMPOSE_LIVE = 'compose.live.yml'

def compose(*arg, compose: COMPOSE_LIVE)
  sh "docker compose -f #{compose} #{arg.join(' ')}"
end


desc 'Git - Submódulos'
namespace :git do

 desc 'Iniciar e atualizar submódulos'
 task :submodules_inicia do
  sh "git submodule init && git submodule update"
 end

 desc 'Atualizar submódulos, últimos commits'
 task :submodules_atualiza do
  sh "git submodule update --recursive --remote"
 end

 desc 'Limpar e remover submódulos'
 task :submodules_zera do
  sh "git submodule deinit -f --all"
 end
end

desc 'Ambiente Vivo'
namespace :vivo do

  desc 'Construir ambiente'
  task :constroi do
      compose('up', '--build', '-d', compose: COMPOSE_LIVE)
  end

  desc 'Eliminar ambiente e remover'
  task :del do
      compose('down', '-v', '--rmi', 'all', compose: COMPOSE_LIVE)
  end

  desc 'Eliminar ambiente'
  task :elimina do
      compose('down', compose: COMPOSE_LIVE)
  end

  desc 'Iniciar ambiente'
  task :liga do
      compose('start', compose: COMPOSE_LIVE)
  end

  desc 'Parar ambiente'
  task :para do
      compose('stop', compose: COMPOSE_LIVE)
  end

  desc 'Reiniciar ambiente'
  task :reinicia do
    compose('restart', compose: COMPOSE_LIVE)
  end

  desc 'Monitorar saída, últimas 50 linhas do programa'
  task :mensagens do
    compose('logs', '-f', '-n 100', 'app.dev', compose: 'compose.live.yml')
  end

  desc 'Entrar no bash do app DivinoAlimento'
  task :sh do
    compose('exec', 'app.dev', 'bash')
  end

  desc 'Popular Entorno'
  task :popular do
    compose('exec', 'db.dev', 'psql', '-U', 'postgres', '-d', 'divinoalimento',  '-f',  '/opt/sql_populate.sql')
  end

  desc 'Entrar no bash do banco de dados DivinoAlimento'
  task :psql do
    compose('exec', 'db.dev', 'psql', '-U', 'postgres')
  end
end
