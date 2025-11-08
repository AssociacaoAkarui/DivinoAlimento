COMPOSE_LIVE = 'compose.live.yml'
COMPOSE_TESTS = 'compose.tests.yml'

def compose(*arg, compose: COMPOSE_LIVE)
  sh "docker compose -f #{compose} #{arg.join(' ')}"
end

def compose_tests(*arg, compose: COMPOSE_TESTS)
  sh "UID=#{ENV['UID']} GID=#{ENV['GID']} docker compose -f #{compose} #{arg.join(' ')}"
end

desc 'Git - Submódulos'
namespace :git do
  desc 'Iniciar e atualizar submódulos'
  task :submodules_inicia do
    sh 'git submodule init && git submodule update'
  end

  desc 'Atualizar submódulos, últimos commits'
  task :submodules_atualiza do
    sh 'git submodule update --recursive --remote'
  end

  desc 'Limpar e remover submódulos'
  task :submodules_zera do
    sh 'git submodule deinit -f --all'
  end
end

desc 'Ambiente Vivo'
namespace :vivo do
  desc 'DB migração'
  task :migracao do
    compose('exec', 'app.dev', 'npx', 'sequelize', 'db:migrate', compose: COMPOSE_LIVE)
  end

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
    compose('exec', '-T', 'db.dev', 'psql', '-U', 'postgres', '-d', 'divinoalimento', '-f', '/opt/sql_populate.sql')
  end

  desc 'Entrar no bash do banco de dados DivinoAlimento'
  task :psql do
    compose('exec', 'db.dev', 'psql', '-U', 'postgres')
  end
end

desc 'Ambiente Testes'
namespace :testes do
  desc 'Construir ambiente'
  task :constroi do
    compose('up', '--build', '-d', compose: COMPOSE_TESTS)
    sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm install"
  end

  desc 'Eliminar ambiente e remover'
  task :del do
    compose('down', '-v', '--rmi', 'all', compose: COMPOSE_TESTS)
  end

  desc 'Eliminar ambiente'
  task :elimina do
    compose('down', compose: COMPOSE_TESTS)
  end

  desc 'Iniciar ambiente'
  task :liga do
    compose('start', compose: COMPOSE_TESTS)
  end

  desc 'Parar ambiente'
  task :para do
    compose('stop', compose: COMPOSE_TESTS)
  end

  desc 'Reiniciar ambiente'
  task :reinicia do
    compose('restart', compose: COMPOSE_TESTS)
  end

  desc 'Monitorar saída, últimas 50 linhas do programa'
  task :mensagens do
    compose('logs', '-f', '-n 100', 'app.dev', compose: 'compose.tests.yml')
  end

  desc 'Entrar no bash do app DivinoAlimento'
  task :sh do
    compose('exec', '-it', 'app_tests.dev', 'bash')
  end

  desc 'Npm Intall'
  task :npm_install do
    sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm install"
  end

  desc 'Executar testes unitários (Mocha)'
  task :unit do
    sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm run test:unit"
  end

  desc 'Executar todos os testes (unitários + cucumber)'
  task :all_tests do
    unit_passed = true
    cucumber_passed = true

    puts "\n#{'='*60}"
    puts "Executando testes unitarios (Mocha)"
    puts "#{'='*60}\n"
    begin
      sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm run test:unit"
    rescue
      unit_passed = false
    end

    puts "\n#{'='*60}"
    puts "Executando testes BDD (Cucumber) - excluindo @pending"
    puts "#{'='*60}\n"
    begin
      sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm test -- --tags \"not @pending\""
    rescue
      cucumber_passed = false
    end

    puts "\n#{'='*60}"
    puts "RESUMO"
    puts "#{'='*60}"
    puts "Mocha:    #{unit_passed ? 'PASSOU' : 'FALHOU'}"
    puts "Cucumber: #{cucumber_passed ? 'PASSOU' : 'FALHOU'}"
    puts "#{'='*60}\n"

    exit 1 unless unit_passed && cucumber_passed
  end

  desc 'Executar testes BDD Cucumber (excluindo @pending por padrao)'
  desc 'Uso: rake testes:bdd # rapido (so pontos)'
  desc '      rake testes:bdd[detalhe] # detalhe e opcional e mostra cada step + backtrace'
  task :bdd, [:detalhe] do |_, args|
    args.with_defaults(detalhe: 'false')
    flags = []
    flags << '--tags'
    flags << '"not @pending"'
    if args.detalhe == 'detalhe'
      flags << '--format-options'
      flags << '\'{\"colorsEnabled\": true}\''
      flags << '--backtrace'
      puts "\n#{'='*60}"
      puts "DEBUG"
      puts "#{'='*60}"
      puts "Mostra cada step + backtrace de erros (excluindo @pending)"
      puts "#{'='*60}\n\n"
    end
    cmd = "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm test"
    cmd += " -- #{flags.join(' ')}" unless flags.empty?
    sh cmd
  end

  desc 'Executar todos os testes (unit + bdd)'
  task :all do
    unit_passed = true
    bdd_passed = true

    puts "\n#{'='*60}"
    puts "Executando testes unitarios (Mocha)"
    puts "#{'='*60}\n"
    begin
      sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm run test:unit"
    rescue
      unit_passed = false
    end

    puts "\n#{'='*60}"
    puts "Executando testes BDD (Cucumber) - excluindo @pending"
    puts "#{'='*60}\n"
    begin
      sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm test -- --tags \"not @pending\""
    rescue
      bdd_passed = false
    end

    puts "\n#{'='*60}"
    puts "RESUMO"
    puts "#{'='*60}"
    puts "Unit: #{unit_passed ? 'PASSOU' : 'FALHOU'}"
    puts "BDD:  #{bdd_passed ? 'PASSOU' : 'FALHOU'}"
    puts "#{'='*60}\n"

    exit 1 unless unit_passed && bdd_passed
  end

  desc 'Executar testes BDD incluindo pendentes'
  task :bdd_with_pending, [:detalhe] do |_, args|
    args.with_defaults(detalhe: 'false')
    flags = []
    if args.detalhe == 'detalhe'
      flags << '--format-options \'{\"colorsEnabled\": true}\''
      flags << '--backtrace'
      puts "\n#{'='*60}"
      puts "DEBUG"
      puts "#{'='*60}"
      puts "Mostra cada step + backtrace de erros (incluindo @pending)"
      puts "#{'='*60}\n\n"
    end
    cmd = "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm test"
    cmd += " -- #{flags.join(' ')}" unless flags.empty?
    sh cmd
  end

  desc 'Executar APENAS testes pendentes (@pending)'
  desc 'Uso: rake testes:pending # rapido (so pontos)'
  desc '      rake testes:pending[detalhe] # detalhe e opcional'
  task :pending, [:detalhe] do |_, args|
    args.with_defaults(detalhe: 'false')
    flags = []
    flags << '--tags'
    flags << '"@pending"'
    if args.detalhe == 'detalhe'
      flags << '--format-options'
      flags << '\'{\"colorsEnabled\": true}\''
      flags << '--backtrace'
      puts "\n#{'='*60}"
      puts "DEBUG"
      puts "#{'='*60}"
      puts "Mostra cada step + backtrace de erros (APENAS @pending)"
      puts "#{'='*60}\n\n"
    end
    cmd = "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm test"
    cmd += " -- #{flags.join(' ')}" unless flags.empty?
    sh cmd
  end

  desc 'Executar testes por funcionalidade'
  desc 'Uso: rake testes:funcionalidade[ciclo] # rápido (só pontos)'
  desc '      rake testes:funcionalidade[produto,detalhe] # detalhe é opcional e mostra cada step + backtrace'
  task :funcionalidade, [:nome_arquivo, :detalhe] do |_, args|
    if args.nome_arquivo.nil?
      puts "\nErro: Nome do arquivo não especificado"
      puts "\nUso: rake testes:funcionalidade[nome_arquivo,detalhe]"
      puts "\nExemplos:"
      puts "  rake testes:funcionalidade[ciclo]"
      puts "  rake testes:funcionalidade[produto,detalhe]"
      exit 1
    end

    args.with_defaults(detalhe: 'false')
    flags = []
    if args.detalhe == 'detalhe'
      flags << '--format-options \'{\"colorsEnabled\": true}\''
      flags << '--backtrace'
      puts "\n#{'='*60}"
      puts "DEBUG"
      puts "#{'='*60}"
      puts "Funcionalidade: #{args.nome_arquivo}"
      puts "Mostra cada step + backtrace de erros"
      puts "#{'='*60}\n\n"
    else
      flags << "--format progress"
    end

    cmd = "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm test -- features/#{args.nome_arquivo}.feature"
    cmd += " #{flags.join(' ')}" unless flags.empty?
    sh cmd
  end

  desc 'Executar teste por expressão de @tags'
  desc 'Uso: rake "testes:tags[expression]" # rápido (só pontos)'
  desc '      rake "testes:tags[expression,detalhe]" # detalhe é opcional e mostra cada step + backtrace'
  task :tags, [:expression, :detalhe] do |_, args|
    if args.expression.nil?
      puts "\nErro: Expressão de tags não especificada"
      puts "\nUso: rake \"testes:tags[expression,detalhe]\""
      puts "\nExemplos:"
      puts "  rake \"testes:tags[@CIC-01]\""
      puts "  rake \"testes:tags[not @pending]\""
      puts "  rake \"testes:tags[@cesta and not @pending,detalhe]\""
      exit 1
    end

    args.with_defaults(detalhe: 'false')
    flags = []
    flags << '--tags'
    flags << "\"#{args.expression}\""
    if args.detalhe == 'detalhe'
      flags << '--backtrace'
      flags << '--format-options'
      flags << '\'{\"colorsEnabled\": true}\''
      puts "\n#{'='*60}"
      puts "DEBUG"
      puts "#{'='*60}"
      puts "Expressao: #{args.expression}"
      puts "Mostra cada step + backtrace de erros"
      puts "#{'='*60}\n\n"
    else
      flags << "--format progress"
    end

    sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm test -- #{flags.join(' ')}"
  end

  desc 'Listar todos os cenários disponíveis'
  task :listar do
    puts "\nCenarios disponiveis:\n\n"
    sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npx cucumber-js --dry-run --format json | grep -o '\"name\":\"[^\"]*\"' | sed 's/\"name\":\"/  /' | sed 's/\"//' || true"
  end
end
