import {Button, Col, Form, Modal, Row, Stack, Table} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {Link, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import ContaApi from "../../api/ContaApi";
import {BsBagXFill, BsBagCheckFill, BsFillPencilFill, BsFillTrashFill} from "react-icons/bs";
import { BsDashCircleFill, BsDashCircle  } from "react-icons/bs";
import { BsExclamationTriangleFill, BsExclamationCircle, BsExclamationCircleFill, BsGraphDown, BsXCircleFill,
    BsCheckLg, BsSearch, BsXCircle, BsCheckCircle, BsFillPlusCircleFill, BsFillPlusCircle} from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import { BsHourglassSplit } from "react-icons/bs";

function ContaList(){

    const [contador, setContador] = useState(0);

    const [tipoPesquisa, setTipoPesquisa] = useState('t');  // Inicializa com 'titular' como valor padrão

    // Função para alterar o tipo de pesquisa com base na seleção
    const handleTipoPesquisaChange = (e) => {
        setTipoPesquisa(e.target.value);
    };

    const [show, setShow] = useState(false);
    const [idDelete, setIdDelete] = useState(false);
    const [contaList, setContaList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const location = useLocation();

    const contaApi = new ContaApi();

    const getConta = (id) => {
        if (id){
            const conta = contaList.find(conta => conta.id === id);
            return conta ? conta.descricao : "Conta não encontrada";
        }
        return null;
    };

    function handleShow(id) {
        setIdDelete(id);
        setShow(true);
    }

    function handleClose() {
        setShow(false);
    }

    function handleExcluir() {
        setShow(false);
        contaApi.excluir(idDelete);
        console.log(`Excluido: ${idDelete}`);
        consultarEPrecherTable();
    }

    useEffect(() => {
        // Inicia o intervalo para chamar a função a cada 2 segundos
        const intervalId = setInterval(() => {
            setContador((prev) => prev + 1);
            if (searchText.trim().length === 0){
                consultarEPrecherTable();
            }
        }, 1000);

        // Limpa o intervalo ao desmontar o componente ou quando a dependência muda
        return () => clearInterval(intervalId);
    }, [location.pathname, searchText]); // Atualiza o intervalo se o pathname mudar

    function consultarEPrecherTable(){
        if (tipoPesquisa === "t"){
            contaApi.getContaByTextTitular(setContaList, searchText);
        }else{
            contaApi.getContaByTextDescricao(setContaList, searchText);
        }
    }

    function submitSearchConta(e) {
        e.preventDefault();
        consultarEPrecherTable();
    }

    function atualizaSituacaoConta(situacao, conta) {
        conta.situacao = situacao;
        contaApi.alterarConta(conta);
        consultarEPrecherTable();
    }

    return(
        <>
            <Container>
                <br/>
                <Row className="mb-3">
                    <Col xl={6}>
                        <h5 className="text-white">
                            Pesquisar Conta
                        </h5>
                    </Col>
                    <Col xl={3}>
                        <h5 className="text-white">
                            Pesquisar Por
                        </h5>
                    </Col>
                    <Col xl={3}>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xl={6}>
                        <Form onDragEnter={submitSearchConta} onChange={submitSearchConta}>
                            <Form.Group className="mb-3" controlId="searchText">
                                <Form.Control
                                    type="text"
                                    placeholder= { tipoPesquisa === "t" ? "Nome do Titular" : "Descrição da conta"}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();  // Impede o envio do formulário ao apertar Enter
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xl={3}>
                        {/* Seletor para tipo de pesquisa */}
                        <Form.Group controlId="tipoPesquisa" className="mb-3">
                            <Form.Select
                                value={tipoPesquisa}
                                onChange={handleTipoPesquisaChange}
                            >
                                <option value="t">Titular</option>
                                <option value="d">Descrição</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xl={3}>
                        {/* Link para adicionar conta */}
                        <Link to="/conta/incluir">
                            <Button>
                                Adicionar Conta
                                &nbsp;
                                <BsFillPlusCircleFill />
                            </Button>
                        </Link>
                    </Col>
                </Row>

                <br/>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Titular</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Vencimento</th>
                        <th>Situação</th>
                        <th>Alterar Conta</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        Array.isArray(contaList) && contaList.map((conta) => (
                            <tr key={conta.id}>
                                <td className="text-start">{conta.id}</td>
                                <td className="text-start">{conta.titular}</td>
                                <td className="text-end">{conta.descricao}</td>
                                <td className="text-start">
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span>R$</span>
                                        <span>{conta.valor.toFixed(2).replace(".",",")}</span>
                                    </div>
                                </td>
                                <td className="text-end">
                                    {new Date(conta.dtVencimento.replace(/-/g, '/')).toLocaleDateString('pt-BR')}
                                </td>
                                {/*Descricao*/}
                                <td className="align-items-end">
                                    <Col sm="10" className="justify-content-end">
                                        <Form.Select
                                            value={conta.situacao}
                                            onChange={(e) => atualizaSituacaoConta(e.target.value, conta)}
                                            className={`situacao-${conta.situacao.toLowerCase()}`}  // Aplica classe no SELECT
                                        >
                                            <option value="Pendente">Pendente ⏳</option>
                                            <option value="Paga">Paga ✔️</option>
                                            <option value="Vencida">Vencida ⚠️</option>
                                        </Form.Select>
                                    </Col>
                                </td>
                                <td>
                                    <Stack direction="horizontal" gap={1}>
                                        <div className="ms-auto">
                                            <Button variant="warning" size="sm"
                                                    onClick={() => handleShow(conta.id)}>
                                                Excluir <BsFillTrashFill/>
                                            </Button>
                                        </div>
                                        <div>
                                            <Link to={`/conta/alterar/${conta.id}`}>
                                                <Button size="sm">
                                                    Editar <BsFillPencilFill/>
                                                </Button>
                                            </Link>
                                        </div>
                                    </Stack>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>

                </Table>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmação</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="fs-3">Confirma a <strong className="text-danger">exclusão</strong> da Conta <strong>{getConta(idDelete)}</strong> de Id <strong>{idDelete}</strong>?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleExcluir}>
                            Excluir <BsFillTrashFill/>
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}

export default ContaList;
