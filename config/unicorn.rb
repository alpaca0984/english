# -*- coding: utf-8 -*-

shared_path = '/var/www/project/english/shared/'
current_path = '/var/www/project/english/current/'

worker_processes Integer(ENV["WEB_CONCURRENCY"] || 3)
timeout 15
preload_app true  # 更新時ダウンタイム無し

# ソケット経由で通信する
# ここがcapistranoの設定と合致していないと失敗する
listen File.expand_path('tmp/sockets/unicorn.sock', shared_path)
pid File.expand_path('tmp/pids/unicorn.pid', shared_path)

# capistrano 用に RAILS_ROOT を指定
working_directory current_path

before_fork do |server, worker|
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection.disconnect!
  end

  old_pid = "#{server.config[:pid]}.oldbin"
  if File.exists?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
    end
  end
end

after_fork do |server, worker|
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.establish_connection
  end
end

# ログの出力
stderr_path File.expand_path('log/unicorn.log', ENV['RAILS_ROOT'])
stdout_path File.expand_path('log/unicorn.log', ENV['RAILS_ROOT'])
