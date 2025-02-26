// @ts-ignore
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {ConfettiCelebration} from "./ConfetiCelebration";

const API_URL = 'https://socialwavequizserver.onrender.com';

const WordleClone = ({username}) => {
    // Internal list of words and descriptions
    const wordList = [
        { word: 'feed', description: 'Sequência cronológica de postagens exibidas aos usuários em uma rede social, personalizada conforme seus interesses e interações' },
        { word: 'hashtag', description: 'Palavra-chave precedida pelo símbolo # que categoriza conteúdos e facilita buscas por temas específicos nas redes sociais' },
        { word: 'engajamento', description: 'Métrica crucial que mede o nível de interações (curtidas, comentários, compartilhamentos, salvamentos) que um conteúdo recebe, indicando sua relevância' },
        { word: 'algoritmo', description: 'Sistema complexo de inteligência artificial que analisa comportamentos e define quais conteúdos são mais relevantes para cada usuário' },
        { word: 'influenciador', description: 'Pessoa com autoridade digital que possui grande alcance e capacidade de impactar decisões de seu público através de recomendações e opiniões' },
        { word: 'stories', description: 'Publicações efêmeras em formato vertical que desaparecem após 24 horas, ideais para conteúdo casual e momentâneo' },
        { word: 'viral', description: 'Conteúdo que se espalha rapidamente pela internet, alcançando milhares ou milhões de visualizações em um curto período de tempo' },
        { word: 'seguidores', description: 'Base de usuários que optam por acompanhar regularmente o conteúdo de uma pessoa, marca ou página nas redes sociais' },
        { word: 'trending', description: 'Tópico ou assunto em alta popularidade em determinado momento, frequentemente destacado em seções especiais das plataformas' },
        { word: 'DM', description: 'Mensagem privada enviada diretamente entre usuários em uma rede social, também conhecida como "direct message" ou mensagem direta' },
        { word: 'reels', description: 'Formato de vídeos curtos e verticais, inspirado no TikTok, que combina música, efeitos visuais e edição rápida' },
        { word: 'timeline', description: 'Linha do tempo que organiza cronologicamente todas as publicações e atualizações de uma rede social' },
        { word: 'bot', description: 'Programa automatizado que simula comportamento humano nas redes sociais, podendo interagir com usuários ou publicar conteúdo' },
        { word: 'newsletter', description: 'Comunicação periódica enviada por email para seguidores interessados em receber conteúdo exclusivo ou atualizações' },
        { word: 'thread', description: 'Sequência de postagens conectadas sobre um mesmo assunto, criando uma narrativa contínua ou discussão aprofundada' },
        { word: 'lurker', description: 'Usuário que consome conteúdo nas redes sociais sem interagir ou publicar, permanecendo apenas como observador' },
        { word: 'shadowban', description: 'Restrição invisível aplicada a uma conta, limitando seu alcance sem notificar o usuário sobre a penalidade' },
        { word: 'troll', description: 'Pessoa que deliberadamente provoca, intimida ou causa discórdia nas redes sociais através de comentários controversos' },
        { word: 'filtro', description: 'Efeito digital que altera a aparência de fotos e vídeos, frequentemente usado para melhorar selfies ou criar conteúdo humorístico' },
        { word: 'sticker', description: 'Imagem ou animação decorativa que pode ser adicionada a stories ou mensagens para expressar emoções ou ideias' },
        { word: 'live', description: 'Transmissão em tempo real que permite interação direta entre criadores de conteúdo e seu público através de comentários' },
        { word: 'meme', description: 'Conteúdo humorístico que se espalha rapidamente pela internet, frequentemente adaptado e remixado por diferentes usuários' },
        { word: 'pods', description: 'Grupos de engajamento mútuo onde usuários combinam de interagir com o conteúdo uns dos outros para aumentar visibilidade' },
        { word: 'impressões', description: 'Número total de vezes que um conteúdo foi exibido, independentemente de quem o visualizou ou se gerou interações' },
        { word: 'alcance', description: 'Métrica que indica o número de contas únicas que visualizaram uma publicação ou perfil em determinado período' }
    ];
    
    
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [message, setMessage] = useState('');
    const [currentRow, setCurrentRow] = useState(0);
    const [animation, setAnimation] = useState(false);
    const inputRef = useRef(null);
    const [showConfetti, setShowConfetti] = useState(false);
    
    const triggerConfetti = (condition: boolean) => {
        setShowConfetti(condition);
        setTimeout(() => setShowConfetti(false), 5000);
    };
    
    const MAX_ATTEMPTS = 5;
    const currentWordObj = wordList[currentWordIndex];
    const normalizedWord = currentWordObj.word.toLowerCase();
    const wordLength = normalizedWord.length;
    
    const emptyGrid = Array(MAX_ATTEMPTS).fill().map(() =>
        Array(wordLength).fill({ letter: '', status: 'empty' })
    );
    
    const [grid, setGrid] = useState(emptyGrid);
    const [keyboardStatus, setKeyboardStatus] = useState({});
    const [completedWords, setCompletedWords] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    
    
    useEffect(() => {
        const newEmptyGrid = Array(MAX_ATTEMPTS).fill().map(() =>
            Array(normalizedWord.length).fill({ letter: '', status: 'empty' })
        );
        setGrid(newEmptyGrid);
        setGuess('');
        setAttempts([]);
        setGameOver(false);
        setWin(false);
        setMessage('');
        setCurrentRow(0);
        setKeyboardStatus({});
        setShowNextButton(false);
        setTimeout(focusInput, 100);
        setShowConfetti(false);
    }, [currentWordIndex, normalizedWord.length]);
    
    const handleKeyDown = (e) => {
        if (gameOver) return;
        
        if (e.key === 'Enter') {
            handleSubmit({ preventDefault: () => {} });
        } else if (e.key === 'Backspace') {
            setGuess(prevGuess => prevGuess.slice(0, -1));
        } else if (/^[a-zA-Z]$/.test(e.key) && guess.length < wordLength) {
            setGuess(prevGuess => prevGuess + e.key.toLowerCase());
        }
    };
    
    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (guess.length !== wordLength) {
            setMessage(`Sua tentativa deve ter ${wordLength} letras.`);
            setAnimation(true);
            setTimeout(() => setAnimation(false), 500);
            return;
        }
        
        const normalizedGuess = guess.toLowerCase();
        const letterCounts = {};
        
        for (let i = 0; i < normalizedWord.length; i++) {
            const letter = normalizedWord[i];
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }
        
        const newGrid = [...grid];
        const rowResult = Array(wordLength).fill(null);
        
        for (let i = 0; i < normalizedGuess.length; i++) {
            const guessedLetter = normalizedGuess[i];
            if (guessedLetter === normalizedWord[i]) {
                rowResult[i] = { letter: guessedLetter, status: 'correct' };
                letterCounts[guessedLetter]--;
            }
        }
        
        for (let i = 0; i < normalizedGuess.length; i++) {
            if (rowResult[i]) continue;
            
            const guessedLetter = normalizedGuess[i];
            if (letterCounts[guessedLetter] && letterCounts[guessedLetter] > 0) {
                rowResult[i] = { letter: guessedLetter, status: 'present' };
                letterCounts[guessedLetter]--;
            } else {
                rowResult[i] = { letter: guessedLetter, status: 'absent' };
            }
        }
        
        newGrid[currentRow] = rowResult;
        setGrid(newGrid);
        
        const newKeyboardStatus = { ...keyboardStatus };
        rowResult.forEach(({ letter, status }) => {
            if (!newKeyboardStatus[letter] ||
                (newKeyboardStatus[letter] === 'absent' && (status === 'present' || status === 'correct')) ||
                (newKeyboardStatus[letter] === 'present' && status === 'correct')) {
                newKeyboardStatus[letter] = status;
            }
        });
        setKeyboardStatus(newKeyboardStatus);
        
        const newAttempts = [...attempts, normalizedGuess];
        setAttempts(newAttempts);
        setGuess('');
        
        if (normalizedGuess === normalizedWord) {
            setWin(true);
            setGameOver(true);
            console.log("Es gay!")
            addWord(currentWordObj.word);
            setCompletedWords(completedWords + 1);
            setMessage(`Parabéns! Você acertou: ${currentWordObj.word.toUpperCase()}`);
            onFinish();
        } else if (newAttempts.length >= MAX_ATTEMPTS) {
            setGameOver(true);
            setMessage(`Que pena! A palavra era: ${currentWordObj.word.toUpperCase()}`);
            onFinish();
        } else {
            setCurrentRow(currentRow + 1);
        }
    };
    
    const points = 100;
    
    const addWord = useCallback(async (word) => {
        try {
            const response = await fetch(`${API_URL}/add-word`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, word, points})
            });
            if (!response.ok) throw new Error('Failed to fetch leaderboard');
            const data = await response.json();
        } catch (error) {
            console.log(error);
        }
    }, []);
    
    const onFinish = () => {
        if (currentWordIndex < wordList.length - 1) {
            triggerConfetti(true);
            setShowNextButton(true);
        } else {
            setMessage(prevMessage => `${prevMessage}. Você completou todas as palavras!`);
        }
    };
    
    const handleNextWord = () => {
        if (currentWordIndex < wordList.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
        }
    };
    
    const handleReset = () => {
        setAttempts([]);
        setGuess('');
        setGameOver(false);
        setWin(false);
        setMessage('');
        setCurrentRow(0);
        setGrid(emptyGrid);
        setKeyboardStatus({});
        setShowNextButton(false);
        setTimeout(focusInput, 100);
    };
    
    const getTileStyle = (status) => {
        switch (status) {
            case 'correct':
                return { backgroundColor: '#6aaa64', borderColor: '#6aaa64', color: 'white' };
            case 'present':
                return { backgroundColor: '#c9b458', borderColor: '#c9b458', color: 'white' };
            case 'absent':
                return { backgroundColor: '#787c7e', borderColor: '#787c7e', color: 'white' };
            default:
                return { backgroundColor: 'white', borderColor: '#d3d6da' };
        }
    };
    
    const keyboard = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
    ];
    
    const handleKeyClick = (key) => {
        if (gameOver) return;
        
        if (key === 'enter') {
            handleSubmit({ preventDefault: () => {} });
        } else if (key === 'backspace') {
            setGuess(prevGuess => prevGuess.slice(0, -1));
        } else if (guess.length < wordLength) {
            setGuess(prevGuess => prevGuess + key);
        }
        focusInput();
    };
    
    const getKeyStyle = (key) => {
        if (key === 'enter' || key === 'backspace') {
            return { backgroundColor: '#d3d6da', minWidth: '65px' };
        }
        
        switch (keyboardStatus[key]) {
            case 'correct':
                return { backgroundColor: '#6aaa64', color: 'white' };
            case 'present':
                return { backgroundColor: '#c9b458', color: 'white' };
            case 'absent':
                return { backgroundColor: '#787c7e', color: 'white' };
            default:
                return { backgroundColor: '#d3d6da' };
        }
    };
    
    const translateKey = (key) => {
        if (key === 'enter') return 'ENVIAR';
        if (key === 'backspace') return '←';
        return key.toUpperCase();
    };
    
    return (
        <Container
            className="py-4 d-flex flex-column align-items-center"
            style={{
                minHeight: '100vh',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
            onClick={focusInput}
        >
            <motion.h1
                className="text-center mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    fontWeight: 'bold',
                    letterSpacing: '0.2rem',
                    color: '#333',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '3rem'
                }}
            >
                Palavra secreta
            </motion.h1>
            
            <div className="w-100 d-flex justify-content-between align-items-center mb-2">
                <div
                    className="badge bg-secondary"
                    style={{
                        fontSize: '1rem',
                        padding: '8px 12px',
                        borderRadius: '20px'
                    }}
                >
                    Palavra {currentWordIndex + 1} de {wordList.length}
                </div>
                <div
                    className="badge bg-success"
                    style={{
                        fontSize: '1rem',
                        padding: '8px 12px',
                        borderRadius: '20px'
                    }}
                >
                    Completadas: {completedWords}
                </div>
            </div>
            
            <Alert
                variant="info"
                className="w-100 text-center"
                style={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                    fontSize: '1.1rem'
                }}
            >
                <strong>Dica: </strong>{currentWordObj.description}
            </Alert>
            
            {message && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-100"
                >
                    <Alert
                        variant={win ? "success" : gameOver ? "danger" : "warning"}
                        className="w-100 text-center"
                        style={{
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                            fontSize: '1.1rem'
                        }}
                    >
                        {message}
                    </Alert>
                </motion.div>
            )}
            
            <motion.div
                className="game-board mb-4"
                style={{ marginTop: '20px' }}
                animate={{ x: animation ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ duration: 0.3 }}
            >
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="d-flex justify-content-center mb-3">
                        {row.map((cell, colIndex) => (
                            <motion.div
                                key={`${rowIndex}-${colIndex}`}
                                initial={{ rotateX: rowIndex === currentRow - 1 ? -90 : 0 }}
                                animate={{
                                    rotateX: 0,
                                    scale: currentRow === rowIndex && colIndex === guess.length ? [1, 1.1, 1] : 1
                                }}
                                transition={{
                                    delay: rowIndex === currentRow - 1 ? colIndex * 0.1 : 0,
                                    duration: 0.3
                                }}
                                style={{
                                    width: '65px',
                                    height: '65px',
                                    border: '2px solid',
                                    margin: '0 5px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '2.2rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    ...getTileStyle(cell.status),
                                    ...(rowIndex === currentRow && !cell.letter && colIndex === guess.length
                                        ? { borderColor: '#888', borderWidth: '3px' }
                                        : {}),
                                    ...(rowIndex === currentRow && colIndex < guess.length
                                        ? {
                                            borderColor: '#888',
                                            backgroundColor: '#f8f9fa',
                                            color: '#333'
                                        }
                                        : {})
                                }}
                            >
                                {rowIndex === currentRow && colIndex < guess.length
                                    ? guess[colIndex]
                                    : cell.letter}
                            </motion.div>
                        ))}
                    </div>
                ))}
            </motion.div>
            
            <Form onSubmit={handleSubmit} className="position-absolute" style={{ opacity: 0 }}>
                <Form.Control
                    ref={inputRef}
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value.slice(0, wordLength).toLowerCase())}
                    maxLength={wordLength}
                    disabled={gameOver}
                    autoFocus
                />
            </Form>
            
            <motion.div
                className="virtual-keyboard mt-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                    background: 'rgba(255,255,255,0.8)',
                    padding: '15px',
                    borderRadius: '10px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}
            >
                {keyboard.map((row, rowIndex) => (
                    <div key={rowIndex} className="d-flex justify-content-center mb-2">
                        {row.map((key) => (
                            <motion.button
                                key={key}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="m-1 text-center border-0"
                                style={{
                                    minWidth: key === 'enter' ? '80px' : '45px',
                                    height: '60px',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                                    fontSize: key === 'enter' || key === 'backspace' ? '0.8rem' : '1.1rem',
                                    ...getKeyStyle(key)
                                }}
                                onClick={() => handleKeyClick(key)}
                                disabled={gameOver && !showNextButton}
                            >
                                {translateKey(key)}
                            </motion.button>
                        ))}
                    </div>
                ))}
            </motion.div>
            
            <div className="d-flex justify-content-center mt-4 gap-3">
                {showNextButton && (
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="border-0"
                        onClick={handleNextWord}
                        style={{
                            backgroundColor: '#4a90e2',
                            color: 'white',
                            padding: '12px 30px',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(74, 144, 226, 0.5)',
                            cursor: 'pointer'
                        }}
                    >
                        Próxima Palavra
                    </motion.button>
                )}
                
                {gameOver && !showNextButton && (
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="border-0"
                        onClick={handleReset}
                        style={{
                            backgroundColor: '#6aaa64',
                            color: 'white',
                            padding: '12px 30px',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(106, 170, 100, 0.5)',
                            cursor: 'pointer'
                        }}
                    >
                        Tentar Novamente
                    </motion.button>
                )}
            </div>
            <ConfettiCelebration trigger={showConfetti} />
        </Container>
    );
};

export default WordleClone;