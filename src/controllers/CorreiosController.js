const knex = require('../database/connection');
const { calcularPrecoPrazo, rastrearEncomendas, consultarCep } = require("correios-brasil");
const PDFKit = require('pdfkit');
let Correios = require('node-correios');
let correios = new Correios();
const path = require('path');
const moment = require('moment')
const fs = require('fs');



var FRONT_URL = 'https://mlevada.herokuapp.com';



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
        const args = {
            sCepOrigem: String(resp[0].origin),
            sCepDestino: String(sCepDestino),
            nVlPeso: String(nVlPeso),
            nCdFormato: formatCheck(),
            nVlComprimento: Number(nVlComprimento),
            nVlAltura: Number(nVlAltura),
            nVlLargura: Number(nVlLargura),
            nCdServico: [String(nCdServico)],
            nVlDiametro: "0"
        }


        // correios.calcPreco(args).then((res) => {
        //     return response.json({ message: 'success', res: res })
        // }).catch((eer) => {
        //     return response.json(eer)
        // })




        calcularPrecoPrazo(args).then((res) => {
            return response.json({
                Codigo: res[0].Codigo,
                Valor: Number(Number(String(res[0].Valor).replace(',', '.')) + Number(resp[0].addition_price)),
                PrazoEntrega: Number(Number(String(res[0].PrazoEntrega).replace(',', '.')) + Number(resp[0].addition_days)),
                ValorSemAdicionais: Number(Number(String(res[0].Valor).replace(',', '.')) + Number(resp[0].addition_price)),
                ValorMaoPropria: res[0].ValorMaoPropria,
                ValorAvisoRecebimento: res[0].ValorAvisoRecebimento,
                ValorDeclarado: res[0].ValorDeclarado,
                EntregaDomiciliar: res[0].EntregaDomiciliar,
                EntregaSabado: res[0].EntregaSabado,
                Erro: res[0].Erro,
                ValorAdd: Number(resp[0].addition_price),
                DaysAdd: Number(resp[0].addition_days)
            })
        })

        // try {
        // const res = await calcularPrecoPrazo(args);
        // return response.json(res)
        // return response.json({
        //     Codigo: res.Codigo,
        //     Valor: Number(Number(String(res.Valor).replace(',', '.')) + Number(resp[0].addition_price)),
        //     PrazoEntrega: Number(Number(String(res.PrazoEntrega).replace(',', '.')) + Number(resp[0].addition_days)),
        //     ValorSemAdicionais: Number(Number(String(res.Valor).replace(',', '.')) + Number(resp[0].addition_price)),
        //     ValorMaoPropria: res.ValorMaoPropria,
        //     ValorAvisoRecebimento: res.ValorAvisoRecebimento,
        //     ValorDeclarado: res.ValorDeclarado,
        //     EntregaDomiciliar: res.EntregaDomiciliar,
        //     EntregaSabado: res.EntregaSabado,
        //     Erro: res.Erro,
        //     ValorAdd: Number(resp[0].addition_price),
        //     DaysAdd: Number(resp[0].addition_days)
        // })



        // } catch (e) {

        //     return response.json({ message: 'error', res: e })
        // }
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
            .text(`Para acompanhar o produto acesse: ${FRONT_URL}/rastrear `, 50, 370, {
                align: 'left',
                link: `${FRONT_URL}/rastrear`,
                underline: true


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


        return response.json({ message: 'success' });
    },
    async download(request, response) {
        const { id } = request.query;
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
    },
    async cep(request, response) {
        const { cep } = request.params;
        consultarCep(cep).then((res) => {
            return response.json({ message: 'success', res: res.localidade })
        })

    }
}

module.exports = CorreiosController;