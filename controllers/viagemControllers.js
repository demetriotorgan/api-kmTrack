const Viagem = require('../models/modelViagem');
const mongoose = require('mongoose');

//registra uma nova viagem
module.exports.adicionarViagem = async(req,res)=>{
    const {
        nome,
        origem,
        destino,
        distanciaObjetivo,
        dataInicio,
        dataFim,
        status,
        notasGerais
    } = req.body;

    try {
        const viagemExistente = await Viagem.findOne({nome});
        if(viagemExistente){
            return res
                .status(409)
                .json({
                    sucess:false,
                    msg:'Esta viagem já existe'
                });
        }

        //Cria nova viagem
        const novaViagem = new Viagem({
        nome,
        origem,
        destino,
        distanciaObjetivo,
        dataInicio,
        dataFim,
        status,
        notasGerais
        });

        await novaViagem.save();
        return res.status(201).json({
            sucess:true,
            msg:'Agendamento cadastrado com sucesso'
        });
    } catch (error) {
        console.error("Erro ao salvar viagem: ", error);
        res.status(500).json({
            sucess:false,
            msg:'Erro ao salvar viagem',
            error: error.message,
            stack: error.stack
        });
    };
};

module.exports.listarViagens = async(req,res)=>{
    try {
        const viagens = await Viagem.find()
        .sort({_id:-1})
        .exec();
        res.status(200).json(viagens)
    } catch (error) {
        res.status(500).json({msg:'Erro ao listar viagens'});
    }
};  