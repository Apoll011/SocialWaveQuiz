// @ts-ignore
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Crossword from '@jaredreisinger/react-crossword';
import { Trophy, Brain } from 'lucide-react';
import { Container, Row, Col, Card, Alert, ListGroup, Badge } from 'react-bootstrap';
import {ConfettiCelebration} from "./ConfetiCelebration";

type Direction = 'across' | 'down';

interface Completion {
    direction: Direction;
    number: number;
    answer: string;
}

interface Submission {
    username: string;
    completion: Completion;
}

interface PlayerScore {
    username: string;
    score: number;
}

interface SubmissionResponse {
    status: 'success' | 'incorrect' | 'already_completed';
    points_earned?: number;
    total_score?: number;
    message?: string;
}

const API_URL = 'https://socialwavequizserver.onrender.com';

const CrosswordGame = ({ username }) => {
    const [leaderboard, setLeaderboard] = useState<PlayerScore[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
    const crosswordRef = useRef(null);
    const [showConfetti, setShowConfetti] = useState(false);
    
    const triggerConfetti = (condition: boolean) => {
        setShowConfetti(condition);
        // Reset after animation
        setTimeout(() => setShowConfetti(false), 5000);
    };
    
    const data = React.useMemo(() => ({
        across: {
            1: {
                clue: 'Rede social para compartilhamento de fotos e vídeos curtos, famosa pelo formato quadrado das imagens',
                answer: 'INSTAGRAM',
                row: 0,
                col: 4,
            },
            3: {
                clue: 'Fluxo digital de visitantes essencial para o sucesso de qualquer plataforma online (termo técnico de marketing digital que mede o volume de pessoas navegando em um site)',
                answer: 'TRAFEGO',
                row: 2,
                col: 5,
            },
            4: {
                clue: 'Publicação digital compartilhada em redes sociais (do inglês, significa "publicar" ou "afixar")',
                answer: 'POST',
                row: 4,
                col: 13,
            },
            5: {
                clue: 'Centro de inovação tecnológica onde empreendedores colaboram (do inglês "technology hub", significa um polo ou núcleo de tecnologia)',
                answer: 'TECHHUB',
                row: 4,
                col: 3,
            },
            7: {
                clue: 'Ação passada de compartilhar conteúdo em plataformas digitais, realizada por várias pessoas',
                answer: 'POSTARAM',
                row: 6,
                col: 1,
            },
            9: {
                clue: 'Debater ideias em ambiente virtual, frequentemente gerando threads extensos (verbo que indica troca de argumentos, às vezes acalorada)',
                answer: 'DISCUTIR',
                row: 8,
                col: 5,
            },
            11: {
                clue: 'Tornar-se assinante de conteúdo de outro usuário para receber atualizações regulares',
                answer: 'SEGUIR',
                row: 10,
                col: 5,
            },
            13: {
                clue: 'Estimular interação e participação ativa dos usuários (termo de marketing que indica criar conexão emocional com o público)',
                answer: 'ENGAJAR',
                row: 12,
                col: 5,
            },
            15: {
                clue: 'Em ascensão de popularidade nas redes sociais (anglicismo que indica tendências ou assuntos em alta)',
                answer: 'TRENDING',
                row: 14,
                col: 3,
            },
            16: {
                clue: 'Conjunto de plataformas digitais para interação social (termo em inglês que abrange todas as redes sociais e estratégias de comunicação online)',
                answer: 'SOCIALMEDIA',
                row: 16,
                col: 5,
            },
        },
        down: {
            2: {
                clue: 'Símbolo # que categoriza conteúdos e facilita buscas (do inglês "hash" + "tag", funciona como etiqueta digital para agrupar assuntos)',
                answer: 'HASHTAG',
                row: 1,
                col: 7,
            },
            6: {
                clue: 'Pictograma digital que expressa emoções em mensagens (do japonês "e" + "moji", significando "imagem" + "personagem")',
                answer: 'EMOJI',
                row: 2,
                col: 14,
            },
            8: {
                clue: 'Timeline constantemente atualizada com informações das redes sociais (termo que descreve o fluxo contínuo de atualizações)',
                answer: 'NOTICIASDASREDES',
                row: 0,
                col: 5,
            },
            10: {
                clue: 'Conjunto de dados pessoais e preferências que compõem sua identidade digital',
                answer: 'PERFIL',
                row: 6,
                col: 12,
            },
            12: {
                clue: 'Relativo às interações humanas em ambiente digital (do latim "socius", significando "companheiro")',
                answer: 'SOCIAL',
                row: 12,
                col: 0,
            },
            14: {
                clue: 'Manifestar aprovação clicando em um botão específico (popularizado pelo Facebook com o símbolo de "polegar para cima")',
                answer: 'CURTIR',
                row: 16,
                col: 7,
            },
        },
    }), []);
    
    const fetchLeaderboard = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/leaderboard`);
            if (!response.ok) throw new Error('Failed to fetch leaderboard');
            const data = await response.json();
            setLeaderboard(data);
        } catch (error) {
            setError('Failed to fetch leaderboard. Please try again later.');
        }
    }, []);
    
    useEffect(() => {
        fetchLeaderboard();
        const intervalId = setInterval(fetchLeaderboard, 5000);
        
        return () => {
            clearInterval(intervalId);
        };
    }, [fetchLeaderboard]);
    
    const handleCorrect = async (direction: Direction, number: number, answer: string) => {
        if (!username || !answer) return;
        
        // Check if word was already completed to prevent duplicate submissions
        const wordKey = `${direction}-${number}`;
        if (completedWords.has(wordKey)) return;
        
        const submission: Submission = {
            username,
            completion: { direction, number, answer }
        };
        
        try {
            const response = await fetch(`${API_URL}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission)
            });
            
            if (!response.ok) throw new Error('Submission failed');
            
            const data: SubmissionResponse = await response.json();
            
            if (data.status === 'success') {
                setCompletedWords(prev => new Set(prev).add(wordKey));
                fetchLeaderboard();
                
                // Show success message if points were earned
                if (data.points_earned) {
                    setError(null);
                }
            }
        } catch (error) {
            setError('Failed to submit answer. Please try again.');
        }
    };
    
    return (
        <Container className="py-4">
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-3">
                                <Brain className="text-primary me-2" size={24} />
                                <h2 className="h4 mb-0">Caça Palavras</h2>
                            </div>
                            <p className="text-muted">
                                Aprenda sobre segurança online e bem-estar digital enquanto se diverte!
                                Complete as palavras cruzadas para testar seus conhecimentos sobre redes
                                sociais e tecnologia.
                            </p>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-3">
                                <Trophy className="text-warning me-2" size={24} />
                                <h2 className="h4 mb-0">Leaderboard</h2>
                            </div>
                            <ListGroup>
                                {leaderboard.map((player, index) => (
                                    <ListGroup.Item
                                        key={index}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <span>
                                            {index + 1}. {player.username}
                                        </span>
                                        <Badge bg="primary" pill>
                                            {player.score}
                                        </Badge>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            {error && (
                                <Alert variant="danger" className="mb-4">
                                    {error}
                                </Alert>
                            )}
                            <div className="crossword-container" style={{ height: '600px' }}>
                                <Crossword
                                    data={data}
                                    ref={crosswordRef}
                                    onCorrect={handleCorrect}
                                    onCrosswordComplete={triggerConfetti}
                                    theme={{
                                        gridBackground: "#ffffff",
                                        cellBackground: "#ffffff",
                                        numberColor: "#000000",
                                        focusBackground: "#e9ecef",
                                        highlightBackground: "#f8f9fa",
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ConfettiCelebration trigger={showConfetti} />
        </Container>
    );
};

export default CrosswordGame;