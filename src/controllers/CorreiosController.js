const knex = require('../database/connection');
const { calcularPrecoPrazo, rastrearEncomendas } = require("correios-brasil");
const PDFKit = require('pdfkit');
const path = require('path');
const moment = require('moment')
const fs = require('fs');
const express = require('express')
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
        const formatCheck = () => {
            if ((nVlPeso <= 1) && (nVlComprimento < 20) && (nVlAltura < 20) && (nVlLargura < 20)) {
                return '3'
            }
            return '1'
        }
        const arg = {
            sCepOrigem: String(resp[0].origin),
            sCepDestino,
            nVlPeso,
            nCdFormato: formatCheck(),
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
            // console.log(res)
            return response.json(res[0])
        } catch (e) {
            console.log(e)
        }
    },
    async pdf(request, response) {
        const {
            code,
            localidade,
            name,
            produto,
        } = request.body;

        const pdf = new PDFKit({
            size: [700, 400],

            margins: { // by default, all are 72
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            },
        });
        pdf.image(path.resolve(__dirname, '..', 'assets', 'logomenina.png'), 240, 30, { scale: 0.12, align: "center" });
        pdf.image(path.resolve(__dirname, '..', 'assets', 'certificate.png'), pdf.page.width - 130, pdf.page.height - 130, { height: 80, width: 80, align: "center" });
        pdf
            .fontSize('16')
            .fillColor('#141414')
            .text(`Cliente: ${name}`, 50, 170, {
                align: 'left'
            })
        pdf
            .fontSize('16')
            .fillColor('#141414')
            .text(`Localidade: ${localidade}`, 50, 220, {
                align: 'left'
            })
        pdf
            .fontSize('16')
            .fillColor('#141414')
            .text(`Produto: ${produto}`, 50, 270, {
                align: 'left'
            })

        pdf
            .lineTo(300, 100)
            .fontSize('16')
            .fillColor('#141414')
            .text(`Código: ${code}`, 50, 320, {
                align: 'left'

            })
        pdf
            .lineTo(300, 100)
            .fontSize('16')
            .fillColor('#141414')
            .text(`Para acompanhar o produto acesse: https://mlevada.herokuapp.com/rastrear `, 50, 370, {
                align: 'left'

            })
        pdf
            .lineTo(300, 100)
            .fontSize('12')
            .fillColor('#141414')
            .text(`${moment(new Date()).format('L')}`, (pdf.page.width - 150), 40, {
                align: 'center'

            })

        pdf.pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'documents', `${code}.pdf`)));
        pdf.end();
        return response.json({ message: 'success' })
    },
    async download(request, response) {
        const { id } = request.params;
        if (id == null) {
            return response.json({ message: 'error', res: 'Falta o ID do certificado' })
        }
        // const file = `src/documents/${id}.pdf`;
        var data = fs.readFileSync(path.resolve(__dirname, '..', 'documents', `${id}.pdf`))
        response.setHeader("Content-type", "application/pdf");
        response.setHeader(
            "Content-disposition",
            'inline; filename="' + id + ".pdf" + '"'
        )
        return response.send(data);
    }
}

module.exports = CorreiosController;