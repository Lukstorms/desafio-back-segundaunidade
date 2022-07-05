let { contas } = require('../bancodedados')



let numeroDaConta = 1;




const listarContas = (req, res) => {
    return res.status(200).json(contas)
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    let saldo = 0;



    const novaConta = {

        nome,
        numero_da_conta: numeroDaConta,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
        saldo,
    }

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "É preciso informar todos os dados!" })
    }

    const cpjJaTem = contas.find((conta) => {
        return conta.cpf === cpf;
    });

    if (cpjJaTem) {
        return res.status(400).json({ mensagem: "O CPF informado já existe cadastrado!" });
    };

    const emailJaTem = contas.find((conta) => {
        return conta.email === email;
    });

    if (emailJaTem) {
        return res.status(400).json({ mensagem: "O email informado já existe cadastrado!" });
    }

    contas.push(novaConta);
    numeroDaConta++

    return res.status(204).json();


}

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params




    if (numeroConta === NaN) {
        return res.status(400).json({ mensagem: "O número da conta não é válido." });
    }
    const contaValida = contas.find((conta) => {
        return conta.numero_da_conta === Number(numeroConta);
    });

    if (!contaValida) {
        return res.status(400).json({ mensagem: "Número da conta é invalido." })
    }


    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "É preciso informar todos os dados!" })
    };

    const cpjJaTem = contas.find((conta) => {
        return conta.cpf === cpf;
    });

    if (cpjJaTem) {
        return res.status(400).json({ mensagem: "O CPF informado já existe cadastrado!" });
    };

    const emailJaTem = contas.find((conta) => {
        return conta.email === email;
    });

    if (emailJaTem) {
        return res.status(400).json({ mensagem: "O email informado já existe cadastrado!" });
    }

    if (contaValida) {
        contaValida.nome = nome;
        contaValida.cpf = cpf;
        contaValida.data_nascimento = data_nascimento;
        contaValida.telefone = telefone;
        contaValida.email = email;
        contaValida.senha = senha
    }

    return res.status(201).json();
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params

    if (numeroConta === NaN) {
        return res.status(400).json({ mensagem: "O número da conta não é válido." });
    }
    const contaValida = contas.find((conta) => {
        return conta.numero_da_conta === Number(numeroConta);
    });

    if (!contaValida) {
        return res.status(400).json({ mensagem: "O número da conta não é válido" })
    } else {
        contas = contas.filter((conta) => {
            return conta.numero_da_conta !== Number(numeroConta);
        });
        console.log(contas);
        return res.status(204).json(204);
    }

}

const saldoDaConta = (req, res) => {
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
    return res.status(200).json(contaValida.saldo);
}




module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    saldoDaConta,
}