const intermediarioSenha = (req, res, next) => {
    const { senha_banco } = req.query;
    if (!senha_banco) {
        return res.status(401).json({ mensagem: 'Informe a senha do banco.' });
    };
    if (senha_banco === 'Cubos123Bank') {
        next()
    } else {
        return res.status(401).json({ mensagem: 'A senha do banco informada é invalida.' });
    }

}

module.exports = {
    intermediarioSenha
}