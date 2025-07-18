import app from './app';
import AppDataSource from './config/data-source';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
.then(() => {
  console.log('📦 Banco conectado com sucesso');
  app.listen(3000, () => {
    console.log('🚀 Servidor rodando na porta ${PORT || 3000}');
  });
}).catch((err: any) => {
  console.error('Erro ao conectar com o banco:', err);
});