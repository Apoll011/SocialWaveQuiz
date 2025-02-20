import React, {useCallback, useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {Navbar, Nav, Container, Row, Col, Card, Form, Button} from 'react-bootstrap';
import CrosswordGame from './CrosswordGame';
import WordleClone from "./WordGuesser.js";

const About = () => (
    <Container className="py-5">
        <div className="card shadow">
            <div className="card-body">
                <h1 className="card-title display-4 mb-4">Sobre a SocialWave</h1>
                <p className="card-text lead mb-4">
                    A SocialWave é uma plataforma digital focada em promover um uso responsável e consciente das redes sociais, incentivando a educação digital e o bem-estar online.
                </p>
                <p className="card-text">
                   Com ferramentas e conteúdos interativos, a Social Wave ajuda jovens a desenvolverem hábitos saudáveis no ambiente digital, protegendo a sua privacidade e promovendo um equilíbrio entre o mundo virtual e a vida real.
                </p>
                <p className="card-text">
                    Com isso pretendemos contribuir para a construção de uma internet mais segura e saudável para todos. Porque acreditamos que a internet é um lugar incrível, e que todos merecem aproveitar o melhor que ela tem a oferecer. Então, vamos juntos surfar nessa onda de mudança?
                </p>
            </div>
        </div>
    </Container>
);

const API_URL = 'http://socialwavequizserver.onrender.com';

const Layout = ({ username, children }) =>{
    const [playerScore, setPlayerScore] = useState(null);

    const fetchPlayerScore = useCallback(async () => {
        if (!username) return;
        try {
            const response = await fetch(`${API_URL}/player/${username}`);
            if (!response.ok) throw new Error('Failed to fetch player score');
            const data = await response.json();
            setPlayerScore(data.score);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchPlayerScore();
    }, [fetchPlayerScore]);


    return (

        <div className="min-vh-100 bg-light">
            <Navbar bg="white" expand="lg" className="shadow-sm mb-3">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <span className="fw-bold">SocialWave </span>
                        <span className="fw-bold px-2 mb-0">Oi {username} </span>
                        {playerScore !== null && (
                            <span className="fw-bold mb-0">Sua pontuação: {playerScore}</span>
                        )}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/">
                                Inicio
                            </Nav.Link>
                            <Nav.Link as={Link} to="/word-guesser">
                                Palavra Secreta
                            </Nav.Link>
                            <Nav.Link as={Link} to="/about">
                                Sobre
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <main>
                {children}
            </main>
        </div>
    );
};

const App = () => {
    const [username, setUsername] = useState(null);
    const [canShowGame, setCanShowGame] = useState(false);

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setCanShowGame(true);
        }
    };

    if (!canShowGame) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="shadow">
                            <Card.Body className="p-5">
                                <h1 className="text-center mb-4">Bem-vindo ao Jogo de Palavras Cruzadas!</h1>
                                <Form onSubmit={handleUsernameSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Seu username"
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" variant="primary" className="w-100">
                                        Entrar
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <Layout username={username}>
                        <CrosswordGame username={username} />
                    </Layout>
                } />
                <Route path="/word-guesser" element={
                    <Layout username={username}>
                        <WordleClone username={username}/>
                    </Layout>
                } />
                <Route path="/about" element={
                    <Layout username={username}>
                        <About />
                    </Layout>
                } />
            </Routes>
        </Router>
    );
};

export default App;