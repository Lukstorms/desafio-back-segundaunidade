let { contas, saques, depositos, transferencias } = require('../bancodedados')

const { format } = require('date-fns')



const deposito = (req, res) => {
    const { numero_conta, valor } = req.body



    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios." })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "Não é possível depositar valor igual ou menor do que zero." })
    }

    const contaValida = contas.find((conta) => {
        return conta.numero_da_conta === Number(numero_conta);
    });

    if (!contaValida) {
        return res.status(400).json({ mensagem: "Número da conta inválido." })
    }

    if (contaValida) {
        contaValida.saldo = contaValida.saldo + Number(valor);
        const horarioOperacao = new Date()
        depositos.push({
            data: `${format(horarioOperacao, `yyyy-MM-dd HH:mm:ss`)}`,
            numero_conta,
            valor
        });
        return res.status(204).json()
    }



}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "Numero da conta, valor e senha devem ser informados." })
    }

    const contaValida = contas.find((conta) => {
        return conta.numero_da_conta === Number(numero_conta);
    });

    if (!contaValida) {
        return res.status(400).json({ mensagem: "A conta informada não existe." })
    }

    if (valor > contaValida.saldo) {
        return res.status(400).json({ mensagem: "Não há saldo suficiente para realizar a operação." })
    }

    if (senha !== contaValida.senha) {
        return res.status(400).json({ mensagem: "A senha informada não está correta." })
    }


    contaValida.saldo = contaValida.saldo - Number(valor);
    const horarioOperacao = new Date();
    saques.push({
        data: `${format(horarioOperacao, `yyyy-MM-dd HH:mm:ss`)}`,
        numero_conta,
        valor
    });


    return res.status(204).json();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "Todos os parâmetros de transferência precisam ser informados." })
    }

    const contaOrigemValida = contas.find((conta) => {
        return conta.numero_da_conta === Number(numero_conta_origem);
    });

    if (!contaOrigemValida) {
        return res.status(400).json({ mensagem: "Conta de origem inválida." })
    }

    const contaDestinoValida = contas.find((conta) => {
        return conta.numero_da_conta === Number(numero_conta_destino);
    });

    if (!contaDestinoValida) {
        return res.status(400).json({ mensagem: "Conta de destino inválida." })
    }

    if (senha !== contaOrigemValida.senha) {
        return res.status(400).json({ mensagem: "Senha incorreta." })
    }

    if (valor > contaOrigemValida.saldo) {
        return res.status(400).json({ mensagem: "Não há saldo suficiente para realizar a operação." })
    }

    contaOrigemValida.saldo = contaOrigemValida.saldo - Number(valor);
    contaDestinoValida.saldo = contaDestinoValida.saldo + Number(valor);


    const horarioOperacao = new Date();

    const transferenciasEnviadas =
    {
        'data': format(horarioOperacao, `yyyy-MM-dd HH:mm:ss`),
        numero_conta_origem,
        numero_conta_destino,
        'valor': Number(valor)
    }


    if (contaOrigemValida.saldo < contaOrigemValida.saldo - Number(valor)) {
        transferencias.push(transferenciasEnviadas);
    }

    const transferenciasRecebidas =
    {
        'data': format(horarioOperacao, `yyyy-MM-dd HH:mm:ss`),
        numero_conta_origem,
        numero_conta_destino,
        'valor': Number(valor)
    }


    if (contaDestinoValida.saldo + Number(valor) > contaDestinoValida.saldo) {
        transferencias.push(transferenciasRecebidas)
    }

    return res.status(204).json();

}

const extrato = (req, res) => {
    const { numero_conta } = req.query
    const { senha } = req.query
    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Número da conta ou senha não foram informados." })
    }

    const contaValida = contas.find((conta) => {
        return conta.numero_da_conta === Number(numero_conta);
    });

    if (!contaValida) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" });
    };

    if (contaValida.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida." })
    }

    const transferenciasEnviadas = transferencias.filter((transferencias) => transferencias.numero_conta_origem === Number(numero_conta))

    const transferenciasRecebidas = transferencias.filter((transferencias) => transferencias.numero_conta_destino === Number(numero_conta))


    const deposito = depositos.filter((deposito) => deposito.numero_conta === Number(numero_conta))

    const saque = saques.filter((saque) => saque.numero_conta === Number(numero_conta))

    const extratoDetalhado = [
        { deposito },
        { saque },
        { transferenciasEnviadas },
        { transferenciasRecebidas },
    ]

    return res.status(200).json(extratoDetalhado)
}





module.exports = {
    deposito,
    sacar,
    transferir,
    extrato
}