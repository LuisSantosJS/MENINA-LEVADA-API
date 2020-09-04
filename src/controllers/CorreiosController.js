const knex = require('../database/connection');
const { calcularPrecoPrazo } = require("correios-brasil");
const CorreiosController = {
    async index(request, response) {
        const {
            sCepDestino,
            nVlPeso,
            nCdFormato,
            nVlComprimento,
            nVlAltura,
            nVlLargura,
            nCdServico,
            nVlDiametro,
        } = request.body;

        if (sCepDestino == null) {
            return response.json({ message: 'error', res: 'falta o Destino' })
        }
        if (nVlPeso == null) {
            return response.json({ message: 'error', res: 'falta o Peso' })
        }
        if (nCdFormato == null) {
            return response.json({ message: 'error', res: 'falta o Formato' })
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
        if (nVlDiametro == null) {
            return response.json({ message: 'error', res: 'falta o Diametro' })
        }

        knex('config').where('id', 1).select('*').then(resp => {
            const arg = {
                sCepOrigem: resp[0].origin,
                sCepDestino,
                nVlPeso,
                nCdFormato,
                nVlComprimento,
                nVlAltura,
                nVlLargura,
                nCdServico,
                nVlDiametro,
            }
            calcularPrecoPrazo(arg).then((res) => {
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
            }).catch(() => {
                return response.json({ message: 'error' })
            })
        })
    }
}

module.exports = CorreiosController;