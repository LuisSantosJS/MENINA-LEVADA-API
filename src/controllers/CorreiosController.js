const knex = require('../database/connection');
const { calcularPrecoPrazo, rastrearEncomendas } = require("correios-brasil");
const CorreiosController = {
    async index(request, response) {
        const {
            sCepDestino,
            nVlPeso,
            nVlComprimento,
            nVlAltura,
            nVlLargura,
            nCdServico,
        } = request.body;

        if (sCepDestino == null) {
            return response.json({ message: 'error', res: 'falta o Destino' })
        }
        if (nVlPeso == null) {
            return response.json({ message: 'error', res: 'falta o Peso' })
        }

        if (nVlComprimento == null) {
            return response.json({ message: 'error', res: 'falta o Comprimento' })
        }
        if (nVlAltura == null) {
            return response.json({ message: 'error', res: 'falta a Altura' })
        }
        if (nVlLargura == null) {
            return response.json({ message: 'error', res: 'falta a Largura' })
        }
        if (nCdServico == null) {
            return response.json({ message: 'error', res: 'falta o Servico' })
        }

        const resp = await knex('config').where('id', 1).select('*');
        const arg = {
            sCepOrigem: String(resp[0].origin),
            sCepDestino,
            nVlPeso,
            nCdFormato: '1',
            nVlComprimento: Number(nVlComprimento),
            nVlAltura: Number(nVlAltura),
            nVlLargura: Number(nVlLargura),
            nCdServico,
            nVlDiametro: 0
        }
        try {
            const res = await calcularPrecoPrazo(arg);
            return response.json({
                Codigo: res.Codigo,
                Valor: Number(Number(String(res.Valor).replace(',', '.')) + resp[0].addition_price),
                PrazoEntrega: Number(Number(String(res.PrazoEntrega).replace(',', '.')) + resp[0].addition_days),
                ValorSemAdicionais: Number(Number(String(res.Valor).replace(',', '.')) + resp[0].addition_price),
                ValorMaoPropria: res.ValorMaoPropria,
                ValorAvisoRecebimento: res.ValorAvisoRecebimento,
                ValorDeclarado: res.ValorDeclarado,
                EntregaDomiciliar: res.EntregaDomiciliar,
                EntregaSabado: res.EntregaSabado,
                Erro: res.Erro,
                ValorAdd: resp[0].addition_price,
                DaysAdd: resp[0].addition_days
            })
        } catch (e) {
            return response.json({ message: 'error', res: e })
        }
    },
    async rast(request, response) {
        const { code } = request.body;
        if (code == null) {
            return response.json({ message: 'error', res: 'Falta o Code' })
        }
        try {
            const res = await rastrearEncomendas(Array(code));
            console.log(res)
            return response.json(res[0])
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = CorreiosController;