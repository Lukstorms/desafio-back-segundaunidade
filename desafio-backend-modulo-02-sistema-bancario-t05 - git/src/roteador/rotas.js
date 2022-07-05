const express = require('express');
const controladordeconta = require('../controladores/controladoresdeconta');
const controlaodordeoperacao = require('../controladores/controladoresdeoperacao')
const { intermediarioSenha } = require('../intermediarios/intermediarios')


const rotas = express();


rotas.get('/contas', intermediarioSenha, controladordeconta.listarContas);
rotas.post('/contas', controladordeconta.criarConta);
rotas.put('/contas/:numeroConta/usuario', controladordeconta.atualizarUsuario);
rotas.delete('/contas/:numeroConta', controladordeconta.excluirConta);
rotas.get('/contas/saldo', controladordeconta.saldoDaConta);


rotas.post('/transacoes/depositar', controlaodordeoperacao.deposito);
rotas.post('/transacoes/sacar', controlaodordeoperacao.sacar);
rotas.post('/transacoes/transferir', controlaodordeoperacao.transferir);
rotas.get('/contas/extrato', controlaodordeoperacao.extrato)

module.exports = rotas