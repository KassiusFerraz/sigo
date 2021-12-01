import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

function Row(props) {
    const { row: consultoria } = props;
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align="right">{consultoria.ativo ? 'Em Andamento' : 'Realizada'}</TableCell>
                <TableCell component="th" scope="row">
                    {consultoria.nome}
                </TableCell>
                <TableCell align="right">{consultoria.dataInicio} a {consultoria.dataFim}</TableCell>
                <TableCell align="right">R$ {consultoria.valorPago}</TableCell>
                <TableCell align="right">{consultoria.quantidadeProfisionais}</TableCell>
            </TableRow>

        </React.Fragment>
    );
}

function ContratoConsultoriaPage() {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const salvarNovaConsultoria = () => {
        const consultoria = {
            nome,
            dataInicio,
            dataFim,
            "valorPago": valorMaximoAutorizadoPagamento,
            "quantidadeProfisionais": quantidadeMaximaProfissionaisConsultoria
        };
        fetch("https://sigo-processos-api.azurewebsites.net/api/v1/consultoria", {
            "method": "POST",
            "headers": {
                "accept": "*/*",
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(consultoria)
        }).then(response => {
            if (response.status === 400) {
                response.json().then(data => {
                    setErrors(data)
                })
            } else {
                requestConsultorias();
                setOpen(false);
            }
        }).catch((err, response) => {
            console.log(response)
            console.error(err);
        });
    }

    const [consultorias, setConsultorias] = React.useState([])
    const requestConsultorias = () => {
        fetch("https://sigo-consultoria-api.azurewebsites.net/api/v1/consultoria", {
            "method": "GET",
            "headers": {
                "accept": "application/json"
            }
        })
            .then(response => response.json()).then(
                data => { setConsultorias(data) }
            )
            .catch(err => {
                console.error(err);
            });
    }

    React.useEffect(() => {
        requestConsultorias()
    }, []);

    const [dataInicio, setDataInicio] = React.useState(null);
    const handleChangeDataInicio = (value) => setDataInicio(value);

    const [dataFim, setDataFim] = React.useState(null);
    const handleChangeDataFim = (value) => setDataFim(value);

    const [nome, setNome] = React.useState('');
    const handleChangeNome = (valor) => setNome(valor.target.value)

    const [valorMaximoAutorizadoPagamento, setValorMaximoAutorizadoPagamento] = React.useState('');
    const handleValorMaximoAutorizadoPagamento = (valor) => setValorMaximoAutorizadoPagamento(valor.target.value)

    const [quantidadeMaximaProfissionaisConsultoria, setQuantidadeMaximaProfissionaisConsultoria] = React.useState('');
    const handleChangeQuantidadeMaximaProfissionaisConsultoria = (valor) => setQuantidadeMaximaProfissionaisConsultoria(valor.target.value)

    const [erros, setErrors] = React.useState([])

    return (
        <Stack spacing={2}>
            <div>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Nova Consultoria
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell><b>Nome</b></TableCell>
                            <TableCell align="right"><b>Tempo de consultoria</b></TableCell>
                            <TableCell align="right"><b>Valor Pago</b></TableCell>
                            <TableCell align="right"><b>Quantidade de profisionais</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {consultorias.map((norma) => (
                            <Row key={norma.id} row={norma} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth={true} >
                <DialogTitle>Nova Norma</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nome"
                            label="Nome"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleChangeNome}
                        />

                        <DesktopDatePicker
                            label="Data inicio"
                            inputFormat="dd/MM/yyyy"
                            value={dataInicio}
                            onChange={handleChangeDataInicio}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="Data fim"
                            inputFormat="dd/MM/yyyy"
                            value={dataFim}
                            onChange={handleChangeDataFim}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            label="Valor da consultoria"
                            type="numer"
                            fullWidth
                            variant="standard"
                            onChange={handleValorMaximoAutorizadoPagamento}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Quantidade de profisionais a contratar"
                            type="numer"
                            fullWidth
                            variant="standard"
                            onChange={handleChangeQuantidadeMaximaProfissionaisConsultoria}
                        />
                        {erros.length > 0 && <TableContainer component={Paper}>
                            <b><p>Os seguintes erros foram econtrados:</p></b>
                            <Table aria-label="table" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Nome da Norma</b></TableCell>
                                        <TableCell><b>Regra infligida</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {erros.map((erro) => (
                                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                            <TableCell >{erro.nomeNorma}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {erro.campo}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={salvarNovaConsultoria}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </Stack>);
}

export default ContratoConsultoriaPage;