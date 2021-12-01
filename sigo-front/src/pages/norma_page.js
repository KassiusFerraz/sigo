import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Select from '@mui/material/Select';

function Row(props) {
    const { row: norma } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {norma.name}
                </TableCell>
                <TableCell align="right">{norma.validade}</TableCell>
                <TableCell align="right">{norma.tipo}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Regras
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Campo</b></TableCell>
                                        <TableCell><b>Valor</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {norma.regras.map((regra) => (
                                        <TableRow key={regra.campo}>
                                            <TableCell>{regra.campo}</TableCell>
                                            <TableCell>{regra.valor}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function NormaPage() {
    const [open, setOpen] = React.useState(false);
    const [normas, setNormas] = React.useState([])

    const requestNormas = () => {
        fetch("https://sigo-norma-api.azurewebsites.net/api/v1/normas", {
            "method": "GET",
            "headers": {
                "accept": "application/json"
            }
        })
            .then(response => response.json()).then(
                data => { setNormas(data)}
            )
            .catch(err => {
                console.error(err);
            });
    }

    React.useEffect(() => {
        requestNormas()
      }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const salvarNovaNorma = () => {
        const norma = {
            "tipo":tipo,
            "validade":validade,
            "name": nome,
            "regras": []
        };
        if (tipo === 'CONTRATO_CONSULTORIA') {
            norma.regras = [
                {
                    campo: "QUANTIDADE_MINIMA_DIAS",
                    valor: quantidadeMinimaDias
                },
                {
                    campo: "VALOR_MAXIMO_AUTORIZADO_PAGAMENTO",
                    valor: valorMaximoAutorizadoPagamento
                },
                {
                    campo: "QUANTIDADE_MAXIMA_PROFISSIONAIS_CONSULTORIA",
                    valor: valorQuantidadeMaximaProfissionaisConsultoria
                }
            ]
        } else {
            norma.regras = [
                {
                    campo: "QUANTIDADE_MINIMA_MAQUINAS",
                    valor: valorQuantidadeMinimaMaquinas
                }
            ]
        }
        console.log(norma)
        fetch("https://sigo-norma-api.azurewebsites.net/api/v1/normas", {
            "method": "POST",
            "headers": {
                "accept": "*/*",
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(norma)
        })
            .then(response => {
                requestNormas();
                setOpen(false);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const [tipo, setTipo] = React.useState('');
    const handleChangeTipo = (event) => setTipo(event.target.value);
    const [validade, setValidade] = React.useState(null);
    const handleChangeValidade = (value) => setValidade(value);
    const [nome, setNome] = React.useState('');
    const handleChangeNome = (valor) => setNome(valor.target.value)
    const [quantidadeMinimaDias, setQuantidadeMinimaDias] = React.useState('')
    const handleChangeQuantidadeMinimaDias = (valor) => setQuantidadeMinimaDias(valor.target.value)
    const [valorMaximoAutorizadoPagamento, setValorMaximoAutorizadoPagamento] = React.useState('')
    const handleChangeValorMaximoAutorizadoPagamento = (valor) => setValorMaximoAutorizadoPagamento(valor.target.value)
    const [valorQuantidadeMaximaProfissionaisConsultoria, setQuantidadeMaximaProfissionaisConsultoria] = React.useState('')
    const handleChangeQuantidadeMaximaProfissionaisConsultoria = (valor) => setQuantidadeMaximaProfissionaisConsultoria(valor.target.value)
    const [valorQuantidadeMinimaMaquinas, setQuantidadeMinimaMaquinas] = React.useState('')
    const handleChangeQuantidadeMinimaMaquinas = (valor) => setQuantidadeMinimaMaquinas(valor.target.value)

    return (
        <Stack spacing={2}>
            <div>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Nova Norma
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell><b>Nome</b></TableCell>
                            <TableCell align="right"><b>Validade</b></TableCell>
                            <TableCell align="right"><b>Tipo</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {normas.map((norma) => (
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
                            label="Data validade"
                            inputFormat="dd/MM/yyyy"
                            value={validade}
                            onChange={handleChangeValidade}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <div>
                            <InputLabel id="Campo Tipo">Tipo</InputLabel>
                            <Select
                                labelId="campo-tipo"
                                id="tipo"
                                fullWidth
                                value={tipo}
                                onChange={handleChangeTipo}
                                label="Tipo"
                            >
                                <MenuItem value="">
                                    <em>Escolha uma opção</em>
                                </MenuItem>
                                <MenuItem value={'CONTRATO_CONSULTORIA'}>Contrato de Consultoria</MenuItem>
                                <MenuItem value={'CONTRATO_MANUTENCAO_MAQUINA'}>Contrato de Manutenção de Máquinas</MenuItem>
                            </Select>
                        </div>
                        {tipo === 'CONTRATO_CONSULTORIA' &&
                            <div>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="QUANTIDADE_MINIMA_DIAS"
                                    label="Quantidade mínima de dias para consultoria"
                                    type="numer"
                                    fullWidth
                                    variant="standard"
                                    onChange={handleChangeQuantidadeMinimaDias}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="VALOR_MAXIMO_AUTORIZADO_PAGAMENTO"
                                    label="Valor máximo autorizado para pagamento de consultoria"
                                    type="numer"
                                    fullWidth
                                    variant="standard"
                                    onChange={handleChangeValorMaximoAutorizadoPagamento}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="QUANTIDADE_MAXIMA_PROFISSIONAIS_CONSULTORIA"
                                    label="Quantidade máxima de profisionais a contratar na consultoria"
                                    type="numer"
                                    fullWidth
                                    variant="standard"
                                    onChange={handleChangeQuantidadeMaximaProfissionaisConsultoria}
                                />
                            </div>}
                        {tipo === 'CONTRATO_MANUTENCAO_MAQUINA' &&
                            <div><TextField
                                autoFocus
                                margin="dense"
                                id="QUANTIDADE_MINIMA_MAQUINAS"
                                label="Quantidade mínima de máquinas para manutenção"
                                type="numer"
                                fullWidth
                                variant="standard"
                                onChange={handleChangeQuantidadeMinimaMaquinas}
                            /> </div>
                        }
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={salvarNovaNorma}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </Stack>);
}

export default NormaPage;