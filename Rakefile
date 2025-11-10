COMPOSE_LIVE = 'compose.live.yml'
COMPOSE_TESTS = 'compose.tests.yml'

def compose(*arg, compose: COMPOSE_LIVE)
  sh "docker compose -f #{compose} #{arg.join(' ')}"
end

def compose_tests(*arg, compose: COMPOSE_TESTS)
  sh "UID=#{ENV['UID']} GID=#{ENV['GID']} docker compose -f #{compose} #{arg.join(' ')}"
end

desc 'Ambiente Vivo'
namespace :vivo do
  desc 'GraphQL Codegen - Gerar tipos do schema GraphQL'
  task :codegen do
    Dir.chdir('frontend') do
      sh 'npm run codegen'
    end
  end

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

  desc 'Monitorar saída, últimas 100 linhas do programa'
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
  desc 'GraphQL Codegen - Gerar tipos do schema GraphQL'
  task :codegen do
    Dir.chdir('frontend') do
      sh 'NODE_ENV=test npm run codegen'
    end
  end

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

  desc 'Monitorar saída, últimas 100 linhas do programa'
  task :mensagens do
    compose('logs', '-f', '-n 100', 'app.dev', compose: 'compose.tests.yml')
  end

  desc 'Entrar no bash do app DivinoAlimento'
  task :sh do
    compose('exec', '-it', 'app_tests.dev', 'bash')
  end

  desc 'Executar testes unitários (Mocha)'
  task :unit do
    sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm run test:unit"
  end

  desc 'Executar testes BDD (Cucumber) - Uso: rake testes:bdd[rapido|completo,excluir|pendentes|somente]'
  task :bdd, [:detalhe, :pending] do |_, args|
    args.with_defaults(detalhe: 'rapido', pending: 'excluir')
    flags = []

    case args.pending
    when 'somente'
      flags << '--tags'
      flags << '"@pending"'
      pending_msg = 'SOMENTE @pending'
    when 'pendentes', 'incluir', 'todos', 'all'
      pending_msg = 'incluindo @pending'
    else
      flags << '--tags'
      flags << '"not @pending"'
      pending_msg = 'excluindo @pending'
    end

    if args.detalhe == 'completo'
      flags << '--format-options'
      flags << '\'{\"colorsEnabled\": true}\''
      flags << '--backtrace'
      puts "\n#{'='*60}"
      puts "MODO DETALHADO"
      puts "#{'='*60}"
      puts "Mostra cada step + backtrace de erros (#{pending_msg})"
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

  desc 'Executar testes por funcionalidade - Uso: rake testes:funcionalidade[arquivo,detalhe] (use rake testes:listar para ver arquivos)'
  task :funcionalidade, [:nome_arquivo, :detalhe] do |_, args|
    if args.nome_arquivo.nil?
      puts "\nErro: Nome do arquivo não especificado"
      puts "\nUso: rake testes:funcionalidade[nome_arquivo,detalhe]"
      puts "\nDica: Execute 'rake testes:listar' para ver os arquivos disponíveis"
      puts "\nExemplos:"
      puts "  rake testes:funcionalidade[ciclo]"
      puts "  rake testes:funcionalidade[categoriaprodutos,detalhe]"
      exit 1
    end

    args.with_defaults(detalhe: 'false')
    flags = []

    if args.detalhe == 'detalhe'
      flags << '--format-options \'{\"colorsEnabled\": true}\''
      flags << '--backtrace'
      puts "\n#{'='*60}"
      puts "MODO DETALHADO"
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

  desc 'Executar teste por expressão de @tags - Uso: rake "testes:tags[expression,detalhe]"'
  task :tags, [:expression, :detalhe] do |_, args|
    if args.expression.nil?
      puts "\nErro: Expressão de tags não especificada"
      puts "\nUso: rake \"testes:tags[expression,detalhe]\""
      puts "\nDica: Execute 'rake testes:listar' para ver as tags disponíveis"
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
      puts "MODO DETALHADO"
      puts "#{'='*60}"
      puts "Expressao: #{args.expression}"
      puts "Mostra cada step + backtrace de erros"
      puts "#{'='*60}\n\n"
    else
      flags << "--format progress"
    end

    sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npm test -- #{flags.join(' ')}"
  end

  desc 'Listar cenários (use ARQUIVO com funcionalidade[ARQUIVO] ou TAG com tags[TAG])'
  task :listar do
    puts "\n#{'='*130}"
    puts "CENÁRIOS DISPONÍVEIS"
    puts "#{'='*130}"
    puts "%-50s | %-12s | %-40s | %s" % ["CENÁRIO", "TAG", "FEATURE", "ARQUIVO"]
    puts "#{'='*130}"
    sh "docker compose -f #{COMPOSE_TESTS} exec -T app_tests.dev npx cucumber-js --dry-run --format json 2>&1 | grep -v 'ExperimentalWarning\\|DeprecationWarning\\|Use `node\\|trace-warnings\\|Recreating\\|Starting\\|Stopping\\|Creating\\|Removing' | jq -r '.[] | select(.elements != null) | . as $feature | .elements[] | .name + (\" \" * (50 - (.name | length))) + \"| \" + ((.tags | map(select(.name | startswith(\"@\") and (. | contains(\"pending\") | not) and (. | test(\"^@[A-Z]+-[0-9]+$\")))) | .[0].name) // \"SEM-TAG     \") + \" | \" + ($feature.name + (\" \" * (40 - ($feature.name | length)))) + \" | \" + ($feature.uri | split(\"/\")[-1] | split(\".\")[0])'"
    puts "\nDica: Use 'rake testes:funcionalidade[ARQUIVO]' ou 'rake \"testes:tags[TAG]\"'"
  end
end
