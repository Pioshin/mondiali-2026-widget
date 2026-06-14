// GLOBAL APP STATE
const STATE = {
    teams: [],
    games: [],
    groups: [],
    stadiums: [],
    teamsMap: {},
    stadiumsMap: {},
    activeTab: 'partite',
    filters: {
        searchPartite: '',
        stage: 'all',
        group: 'all',
        status: 'all' // 'all', 'live', 'finished'
    },
    simulation: {
        timerId: null,
        isPaused: false,
        homeTeam: null,
        awayTeam: null,
        homeScore: 0,
        awayScore: 0,
        homeScorers: [],
        awayScorers: [],
        time: 0,
        speed: 15, // 1 game min = 4s of wall time at 15x
        events: []
    },
    fanta: {
        players: [],
        activePlayerId: '',
        isCloud: false,
        config: {
            endpoint: '',
            apiKey: '',
            dataSource: '',
            database: ''
        }
    }
};

// PLAYER DICTIONARY FOR REALISTIC SIMULATIONS
const TEAM_PLAYERS = {
    "ITA": ["Barella", "Chiesa", "Retegui", "Pellegrini", "Dimarco", "Bastoni", "Frattesi", "Scamacca"],
    "BRA": ["Vinicius Jr.", "Rodrygo", "Endrick", "Raphinha", "Paqueta", "Guimaraes", "Marquinhos", "Martinelli"],
    "ARG": ["Messi", "Alvarez", "Lautaro Martinez", "Mac Allister", "De Paul", "Di Maria", "Fernandez", "Romero"],
    "FRA": ["Mbappe", "Griezmann", "Dembele", "Thuram", "Kolo Muani", "Kante", "Camavinga", "Saliba"],
    "ENG": ["Kane", "Bellingham", "Saka", "Foden", "Palmer", "Rice", "Watkins", "Gordon"],
    "GER": ["Musiala", "Wirtz", "Fullkrug", "Havertz", "Sane", "Gundogan", "Kimmich", "Rudiger"],
    "ESP": ["Yamal", "Morata", "Nico Williams", "Olmo", "Pedri", "Gavi", "Rodri", "Ruiz"],
    "USA": ["Pulisic", "Balogun", "Weah", "McKennie", "Reyna", "Aaronson", "Musah", "Pepi"],
    "MEX": ["Santiago Gimenez", "Lozano", "Martin", "Chavez", "Alvarez", "Antuna", "Pineda", "Quinones"],
    "CAN": ["David", "Davies", "Larin", "Buchanan", "Kone", "Eustaquio", "Millar", "Shaffelburg"],
    "POR": ["Ronaldo", "Bruno Fernandes", "Bernardo Silva", "Joao Felix", "Leao", "Ramos", "Jota", "Vitinha"],
    "JPN": ["Mitoma", "Kubo", "Ueda", "Minamino", "Doan", "Kamada", "Endo", "Ito"],
    "BEL": ["Lukaku", "De Bruyne", "Doku", "Trossard", "Openda", "Bakayoko", "Tielemans", "Carrasco"],
    "NED": ["Depay", "Gakpo", "Simons", "Malen", "Weghorst", "Frimpong", "Reijnders", "Van Dijk"],
    "COL": ["Luis Diaz", "James Rodriguez", "Arias", "Borre", "Sinisterra", "Lerma", "Rios", "Munoz"],
    "URU": ["Nunez", "Suarez", "Valverde", "Bentancur", "De Arrascaeta", "Pellistri", "Araujo", "Olivera"],
    "CRO": ["Modric", "Kramaric", "Petkovic", "Perisic", "Kovacic", "Pasalic", "Majer", "Gvardiol"],
    "MAR": ["En-Nesyri", "Ziyech", "Diaz", "Hakimi", "Ounahi", "Amrabat", "Adli", "Rahimi"],
    "SEN": ["Mane", "Jackson", "Sarr", "Diallo", "Gueye", "Camara", "Koulibaly", "Mendy"],
    "GHA": ["Kudus", "Williams", "Ayew", "Semenyo", "Partey", "Salis", "Lamptey", "Salisu"]
};

// TIMEZONES BY STADIUM ID
const STADIUM_TIMEZONES = {
    "1": "America/Mexico_City",  // Estadio Azteca, Mexico City
    "2": "America/New_York",     // Mercedes-Benz Stadium, Atlanta
    "3": "America/New_York",     // Gillette Stadium, Boston
    "4": "America/Chicago",      // AT&T Stadium, Dallas
    "5": "America/Mexico_City",  // Estadio Akron, Guadalajara
    "6": "America/Chicago",      // NRG Stadium, Houston
    "7": "America/Chicago",      // Arrowhead Stadium, Kansas City
    "8": "America/Los_Angeles",  // SoFi Stadium, Los Angeles
    "9": "America/New_York",     // Hard Rock Stadium, Miami
    "10": "America/Mexico_City", // Estadio BBVA, Monterrey
    "11": "America/New_York",    // MetLife Stadium, New York
    "12": "America/New_York",    // Lincoln Financial Field, Philadelphia
    "13": "America/Los_Angeles", // Levi's Stadium, San Francisco
    "14": "America/Los_Angeles", // Lumen Field, Seattle
    "15": "America/Toronto",     // BMO Field, Toronto
    "16": "America/Vancouver"    // BC Place, Vancouver
};

// DOM ELEMENTS
const DOM = {
    tabs: document.querySelectorAll('.tab-btn'),
    panels: document.querySelectorAll('.tab-panel'),
    statsPlayed: document.getElementById('stat-played'),
    statsGoals: document.getElementById('stat-goals'),
    statsAvgGoals: document.getElementById('stat-avg-goals'),
    liveMatchesTicker: document.getElementById('live-matches-ticker'),
    
    // Partite Tab
    searchPartiteInput: document.getElementById('search-partite-input'),
    filterStageSelect: document.getElementById('filter-stage-select'),
    filterGroupSelect: document.getElementById('filter-group-select'),
    toggleAllMatches: document.getElementById('toggle-all-matches'),
    toggleTodayMatches: document.getElementById('toggle-today-matches'),
    toggleTomorrowMatches: document.getElementById('toggle-tomorrow-matches'),
    toggleLiveMatches: document.getElementById('toggle-live-matches'),
    toggleFinishedMatches: document.getElementById('toggle-finished-matches'),
    forceRefreshBtn: document.getElementById('force-refresh-btn'),
    matchesGrid: document.getElementById('matches-grid'),
    
    // Classifiche Tab
    groupsStandingsGrid: document.getElementById('groups-standings-grid'),
    
    // Tabellone Tab
    bracketContainer: document.getElementById('bracket-container'),
    
    // Squadre Tab
    searchSquadreInput: document.getElementById('search-squadre-input'),
    teamsCardsGrid: document.getElementById('teams-cards-grid'),
    
    // Simulatore Tab
    simConfigPanel: document.getElementById('sim-config-panel'),
    simActivePanel: document.getElementById('sim-active-panel'),
    simMatchSelect: document.getElementById('sim-match-select'),
    simHomeTeam: document.getElementById('sim-home-team'),
    simAwayTeam: document.getElementById('sim-away-team'),
    simSpeed: document.getElementById('sim-speed'),
    startSimulationBtn: document.getElementById('start-simulation-btn'),
    simMatchTimer: document.getElementById('sim-match-timer'),
    simHomeFlag: document.getElementById('sim-home-flag'),
    simHomeName: document.getElementById('sim-home-name'),
    simAwayFlag: document.getElementById('sim-away-flag'),
    simAwayName: document.getElementById('sim-away-name'),
    simMatchScore: document.getElementById('sim-match-score'),
    simProgressBar: document.getElementById('sim-progress-bar'),
    simHomeScorersList: document.getElementById('sim-home-scorers-list'),
    simAwayScorersList: document.getElementById('sim-away-scorers-list'),
    simPauseBtn: document.getElementById('sim-pause-btn'),
    simStopBtn: document.getElementById('sim-stop-btn'),
    simEventList: document.getElementById('sim-event-list'),

    // Scommesse Tab
    dbConnStatus: document.getElementById('db-conn-status'),
    dbSettingsToggleBtn: document.getElementById('db-settings-toggle-btn'),
    dbExplanationText: document.getElementById('db-explanation-text'),
    dbConfigPanel: document.getElementById('db-config-panel'),
    mongoEndpoint: document.getElementById('mongo-endpoint'),
    mongoApiKey: document.getElementById('mongo-apikey'),
    mongoDatasource: document.getElementById('mongo-datasource'),
    mongoDatabase: document.getElementById('mongo-database'),
    dbConnectBtn: document.getElementById('db-connect-btn'),
    dbDisconnectBtn: document.getElementById('db-disconnect-btn'),
    gameLeaderboardBody: document.getElementById('game-leaderboard-body'),
    activePlayerSelect: document.getElementById('active-player-select'),
    createPlayerInput: document.getElementById('create-player-input'),
    createPlayerBtn: document.getElementById('create-player-btn'),
    activePlayerTag: document.getElementById('active-player-tag'),
    betsMatchesList: document.getElementById('bets-matches-list'),
    
    // Footer
    apiStatus: document.getElementById('api-status')
};

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', () => {
    setupTabRouter();
    setupFilters();
    setupSimulatorControls();
    setupFantaMondiali(); // Initialize Scommesse
    loadData().then(() => {
        // Poll live updates from the API every 30 seconds
        setInterval(pollLiveUpdates, 30000);
    });
});

// 1. TABS ROUTER
function setupTabRouter() {
    DOM.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            STATE.activeTab = targetTab;
            
            // Toggle active buttons
            DOM.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Toggle active panels
            DOM.panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`pane-${targetTab}`).classList.add('active');
            
            // Specific panel setups
            if (targetTab === 'simulatore') {
                populateSimulatorDropdowns();
            } else if (targetTab === 'scommesse') {
                syncFantaData();
            } else if (targetTab === 'tabellone') {
                renderBracket();
            }
        });
    });
}

// 2. DATA LOADING ENGINE (API & LOCAL FALLBACK)
async function loadData(forceAPI = false) {
    showLoadingStates();
    
    const cacheKey = 'worldcup2026_data';
    const cacheTimeKey = 'worldcup2026_data_time';
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const cacheDuration = 60 * 1000; // 1 minute cache window

    // If cache is fresh, use it
    if (!forceAPI && cachedData && cachedTime && (Date.now() - cachedTime < cacheDuration)) {
        console.log('Using cached data from LocalStorage');
        try {
            const parsed = JSON.parse(cachedData);
            
            // Handle both flat arrays and wrapped objects
            STATE.teams = parsed.teams ? (parsed.teams.teams || parsed.teams) : [];
            STATE.games = parsed.games ? (parsed.games.games || parsed.games) : [];
            STATE.groups = parsed.groups ? (parsed.groups.groups || parsed.groups) : [];
            STATE.stadiums = parsed.stadiums ? (parsed.stadiums.stadiums || parsed.stadiums) : [];
            
            if (Array.isArray(STATE.teams) && Array.isArray(STATE.games) && Array.isArray(STATE.groups) && Array.isArray(STATE.stadiums) &&
                STATE.teams.length > 0 && STATE.games.length > 0) {
                processData();
                updateApiStatusIndicator('cache');
                return;
            } else {
                console.warn('Cached data is invalid or empty, forcing fresh load');
                localStorage.removeItem(cacheKey);
            }
        } catch (e) {
            console.error('Error parsing cached data:', e);
            localStorage.removeItem(cacheKey);
        }
    }

    try {
        console.log('Fetching live data from API...');
        // Set a timeout to prevent waiting indefinitely if the API is slow
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const [teamsRes, gamesRes, groupsRes, stadiumsRes] = await Promise.all([
            fetch('https://worldcup26.ir/get/teams', { signal: controller.signal }),
            fetch('https://worldcup26.ir/get/games', { signal: controller.signal }),
            fetch('https://worldcup26.ir/get/groups', { signal: controller.signal }),
            fetch('https://worldcup26.ir/get/stadiums', { signal: controller.signal })
        ]);

        clearTimeout(timeoutId);

        const teamsData = await teamsRes.json();
        STATE.teams = teamsData.teams || teamsData;
        
        const gamesData = await gamesRes.json();
        STATE.games = gamesData.games || gamesData;
        
        const groupsData = await groupsRes.json();
        STATE.groups = groupsData.groups || groupsData;
        
        const stadiumsData = await stadiumsRes.json();
        STATE.stadiums = stadiumsData.stadiums || stadiumsData;

        // Validation: Verify that loaded data are actually arrays
        if (!Array.isArray(STATE.teams) || !Array.isArray(STATE.games) || !Array.isArray(STATE.groups) || !Array.isArray(STATE.stadiums)) {
            throw new Error("Dati API non in formato array");
        }

        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify({
            teams: STATE.teams,
            games: STATE.games,
            groups: STATE.groups,
            stadiums: STATE.stadiums
        }));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        
        console.log('API data loaded successfully!');
        processData();
        updateApiStatusIndicator('online');
        
    } catch (err) {
        console.warn('API error, falling back to local files:', err);
        await loadLocalFallback();
    }
}

// FALLBACK TO LOCAL JSON FILES
async function loadLocalFallback() {
    try {
        const [teamsRes, gamesRes, groupsRes, stadiumsRes] = await Promise.all([
            fetch('data/teams.json'),
            fetch('data/games.json'),
            fetch('data/groups.json'),
            fetch('data/stadiums.json')
        ]);

        const teamsData = await teamsRes.json();
        STATE.teams = teamsData.teams || teamsData;
        
        const gamesData = await gamesRes.json();
        STATE.games = gamesData.games || gamesData;
        
        const groupsData = await groupsRes.json();
        STATE.groups = groupsData.groups || groupsData;
        
        const stadiumsData = await stadiumsRes.json();
        STATE.stadiums = stadiumsData.stadiums || stadiumsData;

        console.log('Fallback local data loaded successfully!');
        processData();
        updateApiStatusIndicator('offline');
    } catch (localErr) {
        console.error('Failed to load local fallback files:', localErr);
        showErrorStates();
    }
}

// PROCESS AND MAP DATA STRUCTURES
function processData() {
    // Index teams by ID
    STATE.teamsMap = {};
    STATE.teams.forEach(team => {
        STATE.teamsMap[team.id] = team;
    });

    // Index stadiums by ID
    STATE.stadiumsMap = {};
    STATE.stadiums.forEach(stadium => {
        STATE.stadiumsMap[stadium.id] = stadium;
    });

    // Populate Overview Stats in Header
    renderHeaderStats();
    
    // Render views
    renderLiveMatchesTicker();
    renderMatchesGrid();
    renderGroupsStandings();
    renderTeamsGrid();
    renderBracket();
}

// 3. RENDER HEADER STATS
function renderHeaderStats() {
    let played = 0;
    let goals = 0;

    STATE.games.forEach(game => {
        if (game.finished === 'TRUE' || game.finished === true) {
            played++;
            goals += (parseInt(game.home_score) || 0) + (parseInt(game.away_score) || 0);
        }
    });

    DOM.statsPlayed.innerText = `${played}/${STATE.games.length}`;
    DOM.statsGoals.innerText = goals;
    DOM.statsAvgGoals.innerText = played > 0 ? (goals / played).toFixed(2) : '0.0';
}

function isGameLive(game) {
    if (game.finished === 'TRUE' || game.finished === true || game.time_elapsed === 'finished') {
        return false;
    }
    
    // Explicit API live state
    const apiLive = game.time_elapsed && game.time_elapsed !== 'notstarted' && game.time_elapsed !== 'finished';
    if (apiLive) {
        return true;
    }

    // Clock-based inference fallback
    const tz = STADIUM_TIMEZONES[game.stadium_id] || "America/New_York";
    const startDate = parseLocalDateInTimezone(game.local_date, tz);
    if (!startDate) return false;

    const now = new Date();
    const elapsedMs = now.getTime() - startDate.getTime();
    const matchDurationMs = 105 * 60 * 1000;

    return elapsedMs >= 0 && elapsedMs < matchDurationMs;
}

function getGameDisplayTime(game) {
    if (game.finished === 'TRUE' || game.finished === true || game.time_elapsed === 'finished') {
        return 'FINITA';
    }

    const tz = STADIUM_TIMEZONES[game.stadium_id] || "America/New_York";
    const startDate = parseLocalDateInTimezone(game.local_date, tz);
    const now = new Date();
    const apiLive = game.time_elapsed && game.time_elapsed !== 'notstarted' && game.time_elapsed !== 'finished';

    if (apiLive) {
        return game.time_elapsed === 'live' ? 'LIVE' : game.time_elapsed + '\'';
    }

    if (startDate) {
        const elapsedMs = now.getTime() - startDate.getTime();
        const matchDurationMs = 105 * 60 * 1000;
        
        if (elapsedMs >= 0 && elapsedMs < matchDurationMs) {
            let elapsedMin = Math.floor(elapsedMs / (60 * 1000));
            if (elapsedMin > 45 && elapsedMin < 60) {
                return 'INTERVALLO';
            }
            if (elapsedMin >= 60) {
                elapsedMin -= 15;
            }
            return `${Math.min(90, elapsedMin)}'`;
        }
    }

    return formatGameDate(game.local_date);
}

// 4. RENDER LIVE MATCHES TICKER
function renderLiveMatchesTicker() {
    const liveGames = STATE.games.filter(game => isGameLive(game));

    DOM.liveMatchesTicker.innerHTML = '';
    
    if (liveGames.length === 0) {
        DOM.liveMatchesTicker.innerHTML = `<div class="ticker-empty-msg">Nessuna partita in corso in questo momento. Usa la scheda "Simulatore" per vederne una in azione!</div>`;
        return;
    }

    liveGames.forEach(game => {
        const homeTeam = STATE.teamsMap[game.home_team_id];
        const awayTeam = STATE.teamsMap[game.away_team_id];
        
        const homeName = homeTeam ? homeTeam.name_en : (game.home_team_label || 'TBD');
        const awayName = awayTeam ? awayTeam.name_en : (game.away_team_label || 'TBD');

        const item = document.createElement('div');
        item.className = 'ticker-match-item';
        item.innerHTML = `
            <span class="live-dot animate-pulse"></span>
            <span class="live-time">${getGameDisplayTime(game)}</span>
            <span class="teams">${homeName} vs ${awayName}</span>
            <span class="score">${game.home_score} - ${game.away_score}</span>
        `;
        
        item.addEventListener('click', () => {
            // Filter partite list to show this live match
            DOM.tabs[0].click(); // Go to Matches Tab
            DOM.searchPartiteInput.value = homeName;
            STATE.filters.searchPartite = homeName.toLowerCase();
            renderMatchesGrid();
        });

        DOM.liveMatchesTicker.appendChild(item);
    });
}

function renderMatchesGrid() {
    DOM.matchesGrid.innerHTML = '';
    
    // Filter Games
    const filteredGames = STATE.games.filter(game => {
        const homeTeam = STATE.teamsMap[game.home_team_id];
        const awayTeam = STATE.teamsMap[game.away_team_id];
        
        const homeName = (homeTeam ? homeTeam.name_en : (game.home_team_label || '')).toLowerCase();
        const awayName = (awayTeam ? awayTeam.name_en : (game.away_team_label || '')).toLowerCase();
        const homeFa = (homeTeam ? homeTeam.name_fa : '').toLowerCase();
        const awayFa = (awayTeam ? awayTeam.name_fa : '').toLowerCase();
        
        // Search matches by team name
        const matchSearch = STATE.filters.searchPartite;
        const searchMatches = !matchSearch || homeName.includes(matchSearch) || awayName.includes(matchSearch) || homeFa.includes(matchSearch) || awayFa.includes(matchSearch);
        
        // Filter by stage
        const filterStage = STATE.filters.stage === 'all' || game.type === STATE.filters.stage;
        
        // Filter by group
        const filterGroup = STATE.filters.group === 'all' || game.group === STATE.filters.group;
        
        // Filter by live/finished status
        const finishedVal = game.finished === 'TRUE' || game.finished === true;
        const isLive = isGameLive(game);
        
        let filterStatus = true;
        if (STATE.filters.status === 'live') {
            filterStatus = isLive && !finishedVal;
        } else if (STATE.filters.status === 'finished') {
            filterStatus = finishedVal;
        } else if (STATE.filters.status === 'today' || STATE.filters.status === 'tomorrow') {
            const tz = STADIUM_TIMEZONES[game.stadium_id] || "America/New_York";
            const startDate = parseLocalDateInTimezone(game.local_date, tz);
            if (!startDate) {
                filterStatus = false;
            } else {
                const today = new Date();
                if (STATE.filters.status === 'today') {
                    filterStatus = startDate.getFullYear() === today.getFullYear() &&
                                   startDate.getMonth() === today.getMonth() &&
                                   startDate.getDate() === today.getDate();
                } else {
                    const tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);
                    filterStatus = startDate.getFullYear() === tomorrow.getFullYear() &&
                                   startDate.getMonth() === tomorrow.getMonth() &&
                                   startDate.getDate() === tomorrow.getDate();
                }
            }
        }
        
        return searchMatches && filterStage && filterGroup && filterStatus;
    });

    if (filteredGames.length === 0) {
        DOM.matchesGrid.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <h4>Nessuna Partita Trovata</h4>
                <p>Nessun incontro corrisponde ai filtri selezionati. Prova a modificarli.</p>
            </div>
        `;
        return;
    }

    // Sort matches purely chronologically by match ID (1 to 104)
    filteredGames.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    filteredGames.forEach(game => {
        const homeTeam = STATE.teamsMap[game.home_team_id];
        const awayTeam = STATE.teamsMap[game.away_team_id];
        
        const homeName = homeTeam ? homeTeam.name_en : (game.home_team_label || 'TBD');
        const awayName = awayTeam ? awayTeam.name_en : (game.away_team_label || 'TBD');
        const homeFlag = homeTeam ? homeTeam.flag : null;
        const awayFlag = awayTeam ? awayTeam.flag : null;
        
        const finishedVal = game.finished === 'TRUE' || game.finished === true;
        const isLive = isGameLive(game);
        
        const tz = STADIUM_TIMEZONES[game.stadium_id] || "America/New_York";
        const startDate = parseLocalDateInTimezone(game.local_date, tz);
        
        let userTimeStr = '';
        let stadiumTimeStr = '';
        let stadiumAbbr = '';
        
        if (startDate) {
            userTimeStr = startDate.toLocaleString('it-IT', { 
                day: 'numeric', month: 'short', 
                hour: '2-digit', minute: '2-digit' 
            });
            stadiumTimeStr = game.local_date.split(' ')[1]; // E.g., "20:00"
            stadiumAbbr = getTzAbbreviation(tz, startDate);
        }

        let statusClass = 'upcoming';
        let statusText = formatGameDate(game.local_date);
        
        if (isLive && !finishedVal) {
            statusClass = 'live-now';
            statusText = `LIVE &bull; ${getGameDisplayTime(game)}`;
        } else if (finishedVal) {
            statusClass = 'finished';
            statusText = 'FINITA';
        }

        // Winner highlighting
        const homeScoreVal = parseInt(game.home_score) || 0;
        const awayScoreVal = parseInt(game.away_score) || 0;
        let homeWinnerClass = '';
        let awayWinnerClass = '';
        if (finishedVal) {
            if (homeScoreVal > awayScoreVal) {
                homeWinnerClass = 'winner';
                awayWinnerClass = 'loser';
            } else if (awayScoreVal > homeScoreVal) {
                awayWinnerClass = 'winner';
                homeWinnerClass = 'loser';
            }
        }

        const card = document.createElement('div');
        card.className = `match-card ${isLive && !finishedVal ? 'live' : ''}`;
        card.setAttribute('data-game-id', game.id);
        
        const stadium = STATE.stadiumsMap[game.stadium_id];
        const stadiumName = stadium ? (stadium.name_en || stadium.name) : `Stadium ${game.stadium_id}`;

        let scorersHtml = '';
        if (finishedVal && (game.home_scorers !== 'null' || game.away_scorers !== 'null')) {
            const hs = game.home_scorers && game.home_scorers !== 'null' ? game.home_scorers.split(',') : [];
            const as = game.away_scorers && game.away_scorers !== 'null' ? game.away_scorers.split(',') : [];
            
            if (hs.length > 0 || as.length > 0) {
                scorersHtml = `
                    <div class="match-scorers-preview">
                        ${hs.length > 0 ? `<div class="scorers-row"><span class="scorers-bullet">⚽</span> ${homeTeam ? homeTeam.iso2 : 'CASA'}: ${hs.join(', ')}</div>` : ''}
                        ${as.length > 0 ? `<div class="scorers-row"><span class="scorers-bullet">⚽</span> ${awayTeam ? awayTeam.iso2 : 'FUORI'}: ${as.join(', ')}</div>` : ''}
                    </div>
                `;
            }
        }

        let timeBadgeHtml = '';
        let addToCalHtml = '';
        if (!finishedVal && !isLive && startDate) {
            timeBadgeHtml = `
                <div class="match-time-badge-container">
                    <div class="match-time-user">${userTimeStr} <span class="badge-local">Tua Ora</span></div>
                    <div class="match-time-stadium">Ora Stadio: ${stadiumTimeStr} ${stadiumAbbr}</div>
                </div>
            `;
            addToCalHtml = `
                <button class="add-to-calendar-btn" onclick="exportMatchToCalendar('${game.id}')" title="Aggiungi al tuo calendario (Google, Apple, Outlook...)">
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Promemoria</span>
                </button>
            `;
        }

        card.innerHTML = `
            <div class="match-card-header">
                <span class="match-stage">${translateStage(game.type)} &bull; Girone ${game.group}</span>
                <span class="match-id">Match ${game.id}</span>
            </div>
            <div class="match-card-body">
                <div class="match-team-row ${homeWinnerClass}">
                    <div class="team-info">
                        ${homeFlag ? `<img src="${homeFlag}" alt="" class="team-flag">` : `<div class="team-flag-placeholder">?</div>`}
                        <span>${homeName}</span>
                    </div>
                    <div class="score-box">${finishedVal || isLive ? game.home_score : '-'}</div>
                </div>
                <div class="match-team-row ${awayWinnerClass}">
                    <div class="team-info">
                        ${awayFlag ? `<img src="${awayFlag}" alt="" class="team-flag">` : `<div class="team-flag-placeholder">?</div>`}
                        <span>${awayName}</span>
                    </div>
                    <div class="score-box">${finishedVal || isLive ? game.away_score : '-'}</div>
                </div>
                ${scorersHtml}
                ${timeBadgeHtml}
            </div>
            <div class="match-card-footer">
                <div class="match-venue" title="${stadiumName}">
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>${stadiumName}</span>
                </div>
                ${addToCalHtml ? addToCalHtml : `<span class="match-status ${statusClass}">${statusText}</span>`}
            </div>
        `;
        
        DOM.matchesGrid.appendChild(card);
    });
}

// 6. RENDER STANDINGS TAB
function renderGroupsStandings() {
    DOM.groupsStandingsGrid.innerHTML = '';
    
    if (STATE.groups.length === 0) {
        DOM.groupsStandingsGrid.innerHTML = `
            <div class="empty-state">
                <p>Nessun dato di classifica disponibile.</p>
            </div>
        `;
        return;
    }

    // Sort groups alphabetically by name (A to L)
    const sortedGroups = [...STATE.groups].sort((a, b) => a.name.localeCompare(b.name));

    sortedGroups.forEach(group => {
        const card = document.createElement('div');
        card.className = 'group-card';
        
        // Sort teams inside group by points, goal difference, goals scored
        const sortedTeams = [...group.teams].sort((a, b) => {
            const ptsA = parseInt(a.pts) || 0;
            const ptsB = parseInt(b.pts) || 0;
            const gdA = parseInt(a.gd) || 0;
            const gdB = parseInt(b.gd) || 0;
            const gfA = parseInt(a.gf) || 0;
            const gfB = parseInt(b.gf) || 0;
            
            if (ptsA !== ptsB) return ptsB - ptsA;
            if (gdA !== gdB) return gdB - gdA;
            return gfB - gfA;
        });

        let rowsHtml = '';
        sortedTeams.forEach((item, index) => {
            const teamInfo = STATE.teamsMap[item.team_id];
            const teamName = teamInfo ? teamInfo.name_en : `Team ${item.team_id}`;
            const teamFlag = teamInfo ? teamInfo.flag : '';
            
            // Qualification highlights (top 2 direct, 3rd best terze possible)
            let rowQualifyClass = '';
            if (index < 2) {
                rowQualifyClass = 'qualify-direct';
            } else if (index === 2) {
                rowQualifyClass = 'qualify-best-3rd';
            }

            rowsHtml += `
                <tr class="${rowQualifyClass}">
                    <td class="col-rank">${index + 1}</td>
                    <td class="col-team">
                        <div class="table-team-cell">
                            ${teamFlag ? `<img src="${teamFlag}" alt="" class="team-flag">` : `<div class="team-flag-placeholder">?</div>`}
                            <span title="${teamName}">${teamName}</span>
                        </div>
                    </td>
                    <td class="col-stat">${item.mp}</td>
                    <td class="col-stat">${item.gd > 0 ? '+' + item.gd : item.gd}</td>
                    <td class="col-pts">${item.pts}</td>
                </tr>
            `;
        });

        card.innerHTML = `
            <h3>Girone ${group.name} <span>G - DR - Punti</span></h3>
            <table class="standings-table">
                <thead>
                    <tr>
                        <th class="col-rank">#</th>
                        <th class="col-team">Squadra</th>
                        <th class="col-stat">G</th>
                        <th class="col-stat">DR</th>
                        <th class="col-pts">Pt</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        `;

        DOM.groupsStandingsGrid.appendChild(card);
    });
}

// 7. RENDER TEAMS TAB
function renderTeamsGrid() {
    DOM.teamsCardsGrid.innerHTML = '';
    
    const query = STATE.filters.searchSquadre || '';
    const filteredTeams = STATE.teams.filter(team => {
        return team.name_en.toLowerCase().includes(query) || 
               team.groups.toLowerCase().includes(query) ||
               team.fifa_code.toLowerCase().includes(query);
    });

    if (filteredTeams.length === 0) {
        DOM.teamsCardsGrid.innerHTML = `
            <div class="empty-state">
                <h4>Nessuna Squadra Trovata</h4>
                <p>Nessun team corrisponde al testo cercato.</p>
            </div>
        `;
        return;
    }

    // Sort teams alphabetically
    filteredTeams.sort((a, b) => a.name_en.localeCompare(b.name_en));

    filteredTeams.forEach(team => {
        const card = document.createElement('div');
        card.className = 'team-card';
        
        // Find team matches
        const teamGames = STATE.games.filter(game => {
            return game.home_team_id === team.id || game.away_team_id === team.id;
        }).slice(0, 3); // Grab group matches

        let matchesListHtml = '';
        teamGames.forEach(game => {
            const opponentId = game.home_team_id === team.id ? game.away_team_id : game.home_team_id;
            const opponentTeam = STATE.teamsMap[opponentId];
            const opponentName = opponentTeam ? opponentTeam.name_en : (game.home_team_id === team.id ? game.away_team_label : game.home_team_label) || 'TBD';
            
            const isHome = game.home_team_id === team.id;
            const isFinished = game.finished === 'TRUE' || game.finished === true;
            
            let scoreText = 'vs';
            if (isFinished) {
                const scoreHome = parseInt(game.home_score) || 0;
                const scoreAway = parseInt(game.away_score) || 0;
                scoreText = isHome ? `${scoreHome}-${scoreAway}` : `${scoreAway}-${scoreHome}`;
            } else {
                // Parse date
                scoreText = formatShortDate(game.local_date);
            }

            matchesListHtml += `
                <div class="team-card-game-row">
                    <span class="opponent">${opponentName}</span>
                    <span class="score">${scoreText}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="team-card-header">
                <img src="${team.flag}" alt="${team.name_en} Flag">
                <div class="team-card-title">
                    <h4>${team.name_en}</h4>
                    <span>Girone ${team.groups} &bull; FIFA Code: ${team.fifa_code}</span>
                </div>
            </div>
            <div class="team-card-games">
                <div class="team-card-games-title">Incontri</div>
                ${matchesListHtml}
            </div>
        `;
        
        // Custom Interaction: Clicking a team card opens the matches tab pre-filtered by this team!
        card.addEventListener('click', () => {
            DOM.tabs[0].click(); // Click Matches Tab
            DOM.searchPartiteInput.value = team.name_en;
            STATE.filters.searchPartite = team.name_en.toLowerCase();
            renderMatchesGrid();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        DOM.teamsCardsGrid.appendChild(card);
    });
}

// 8. TABS AND SEARCH FILTERS SETUP
function setupFilters() {
    // Matches Tab Filters
    DOM.searchPartiteInput.addEventListener('input', (e) => {
        STATE.filters.searchPartite = e.target.value.toLowerCase().trim();
        renderMatchesGrid();
    });

    DOM.filterStageSelect.addEventListener('change', (e) => {
        STATE.filters.stage = e.target.value;
        renderMatchesGrid();
    });

    DOM.filterGroupSelect.addEventListener('change', (e) => {
        STATE.filters.group = e.target.value;
        renderMatchesGrid();
    });

    // Status filter buttons
    const statusBtns = [
        DOM.toggleAllMatches, 
        DOM.toggleTodayMatches, 
        DOM.toggleTomorrowMatches, 
        DOM.toggleLiveMatches, 
        DOM.toggleFinishedMatches
    ];
    statusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            statusBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn === DOM.toggleAllMatches) STATE.filters.status = 'all';
            else if (btn === DOM.toggleTodayMatches) STATE.filters.status = 'today';
            else if (btn === DOM.toggleTomorrowMatches) STATE.filters.status = 'tomorrow';
            else if (btn === DOM.toggleLiveMatches) STATE.filters.status = 'live';
            else if (btn === DOM.toggleFinishedMatches) STATE.filters.status = 'finished';
            
            renderMatchesGrid();
        });
    });

    // Refresh Button
    DOM.forceRefreshBtn.addEventListener('click', () => {
        loadData(true);
    });

    // Teams Tab Filters
    DOM.searchSquadreInput.addEventListener('input', (e) => {
        STATE.filters.searchSquadre = e.target.value.toLowerCase().trim();
        renderTeamsGrid();
    });
}

// 9. POPULATE SIMULATOR DROPDOWNS
function populateSimulatorDropdowns() {
    if (STATE.teams.length === 0) return;
    
    // Sort teams alphabetically
    const sorted = [...STATE.teams].sort((a, b) => a.name_en.localeCompare(b.name_en));

    // Fill home dropdown
    DOM.simHomeTeam.innerHTML = '';
    DOM.simAwayTeam.innerHTML = '';

    sorted.forEach((team, index) => {
        const optHome = document.createElement('option');
        optHome.value = team.id;
        optHome.innerText = `${team.name_en} (Girone ${team.groups})`;
        
        const optAway = document.createElement('option');
        optAway.value = team.id;
        optAway.innerText = `${team.name_en} (Girone ${team.groups})`;
        
        // Pick Spain and Italy as default picks, or España and Argentina
        if (team.iso2 === 'IT' || team.fifa_code === 'ITA') optHome.selected = true;
        if (team.iso2 === 'BR' || team.fifa_code === 'BRA') optAway.selected = true;

        DOM.simHomeTeam.appendChild(optHome);
        DOM.simAwayTeam.appendChild(optAway);
    });

    // Populate matches select dropdown
    if (DOM.simMatchSelect) {
        DOM.simMatchSelect.innerHTML = '<option value="">-- Partita Libera (Nessuna associazione al calendario) --</option>';
        // Show notstarted/upcoming games
        const upcomingGames = STATE.games.filter(g => g.finished !== 'TRUE' && g.finished !== true);
        upcomingGames.forEach(game => {
            const homeT = STATE.teamsMap[game.home_team_id];
            const awayT = STATE.teamsMap[game.away_team_id];
            const homeName = homeT ? homeT.name_en : (game.home_team_label || 'TBD');
            const awayName = awayT ? awayT.name_en : (game.away_team_label || 'TBD');
            const opt = document.createElement('option');
            opt.value = game.id;
            opt.innerText = `Gara ${game.id}: ${homeName} vs ${awayName} (${translateStage(game.type)})`;
            DOM.simMatchSelect.appendChild(opt);
        });
    }
}

// 10. INTERACTIVE MATCH SIMULATOR ENGINE
function setupSimulatorControls() {
    DOM.startSimulationBtn.addEventListener('click', startMatchSimulation);
    DOM.simPauseBtn.addEventListener('click', togglePauseSimulation);
    DOM.simStopBtn.addEventListener('click', stopMatchSimulation);

    if (DOM.simMatchSelect) {
        DOM.simMatchSelect.addEventListener('change', (e) => {
            const selectedMatchId = e.target.value;
            if (selectedMatchId) {
                const game = STATE.games.find(g => g.id == selectedMatchId);
                if (game) {
                    DOM.simHomeTeam.value = game.home_team_id;
                    DOM.simAwayTeam.value = game.away_team_id;
                    DOM.simHomeTeam.disabled = true;
                    DOM.simAwayTeam.disabled = true;
                }
            } else {
                DOM.simHomeTeam.disabled = false;
                DOM.simAwayTeam.disabled = false;
            }
        });
    }
}

function startMatchSimulation() {
    const homeId = DOM.simHomeTeam.value;
    const awayId = DOM.simAwayTeam.value;
    
    if (homeId === awayId) {
        alert('Seleziona due squadre diverse per la simulazione.');
        return;
    }

        const homeTeam = STATE.teamsMap[homeId];
    const awayTeam = STATE.teamsMap[awayId];
    const speed = parseInt(DOM.simSpeed.value) || 15;
    const associatedMatchId = DOM.simMatchSelect ? DOM.simMatchSelect.value : '';

    STATE.simulation = {
        timerId: null,
        isPaused: false,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: 0,
        awayScore: 0,
        homeScorers: [],
        awayScorers: [],
        time: 0,
        speed: speed,
        events: [],
        matchId: associatedMatchId
    };

    if (associatedMatchId) {
        const tournamentGame = STATE.games.find(g => g.id == associatedMatchId);
        if (tournamentGame) {
            tournamentGame.home_score = '0';
            tournamentGame.away_score = '0';
            tournamentGame.time_elapsed = '0';
            tournamentGame.finished = false;
            tournamentGame.home_scorers = 'null';
            tournamentGame.away_scorers = 'null';
            
            // Re-render matches grid and ticker to show it is live
            renderLiveMatchesTicker();
            if (STATE.activeTab === 'partite') renderMatchesGrid();
            if (STATE.activeTab === 'tabellone') renderBracket();
        }
    }

    // Update UI panels
    DOM.simConfigPanel.classList.add('hidden');
    DOM.simActivePanel.classList.remove('hidden');

    DOM.simHomeFlag.src = homeTeam.flag;
    DOM.simHomeName.innerText = homeTeam.name_en;
    DOM.simAwayFlag.src = awayTeam.flag;
    DOM.simAwayName.innerText = awayTeam.name_en;
    
    DOM.simMatchScore.innerText = '0 - 0';
    DOM.simMatchTimer.innerText = '00:00';
    DOM.simProgressBar.style.width = '0%';
    DOM.simHomeScorersList.innerHTML = '';
    DOM.simAwayScorersList.innerHTML = '';
    DOM.simPauseBtn.innerText = 'Pausa';
    
    DOM.simEventList.innerHTML = `<div class="event-row system-msg">Fischio d'inizio! Benvenuti allo stadio per ${homeTeam.name_en} vs ${awayTeam.name_en}.</div>`;

    // Start ticker loop
    const wallMsInterval = Math.max(100, 4000 / speed); // 4 seconds divided by speed (at 15x, ~266ms per game minute)
    
    STATE.simulation.timerId = setInterval(simulationTick, wallMsInterval);
}

function simulationTick() {
    const sim = STATE.simulation;
    if (sim.isPaused) return;

    sim.time++;
    
    // Format and Update Clock
    DOM.simMatchTimer.innerText = formatSimClock(sim.time);
    DOM.simProgressBar.style.width = `${(sim.time / 90) * 100}%`;

    // Update tournament game live state in real-time
    if (sim.matchId) {
        const tournamentGame = STATE.games.find(g => g.id == sim.matchId);
        if (tournamentGame) {
            tournamentGame.home_score = sim.homeScore.toString();
            tournamentGame.away_score = sim.awayScore.toString();
            tournamentGame.time_elapsed = sim.time.toString();
            tournamentGame.finished = false;
            
            // Format simulated scorers list as JSON string matching API parser
            tournamentGame.home_scorers = JSON.stringify(sim.homeScorers.map(s => `${s.name} ${s.minute}'`));
            tournamentGame.away_scorers = JSON.stringify(sim.awayScorers.map(s => `${s.name} ${s.minute}'`));
            
            // Refresh views
            renderLiveMatchesTicker();
            if (STATE.activeTab === 'partite') renderMatchesGrid();
            if (STATE.activeTab === 'tabellone') renderBracket();
            
            // Update modal if open for this match
            updateModalLiveUpdates();
        }
    }

    // Halftime Pause Trigger
    if (sim.time === 45) {
        pauseTickerTemporarily(3000); // 3 seconds wall-time halftime break
        logSimEvent(45, "Intervallo! L'arbitro fischia la fine del primo tempo. Squadre negli spogliatoi.", 'system-msg');
        return;
    }

    // Fulltime Trigger
    if (sim.time >= 90) {
        clearInterval(sim.timerId);
        logSimEvent(90, `Fischio finale! Partita terminata. Risultato finale: ${sim.homeTeam.name_en} ${sim.homeScore} - ${sim.awayScore} ${sim.awayTeam.name_en}.`, 'system-msg');
        DOM.simPauseBtn.classList.add('hidden');
        DOM.simStopBtn.innerText = 'Configura Nuova Partita';
        
        // If there's an associated match ID, resolve it in the tournament schedule!
        if (sim.matchId) {
            const tournamentGame = STATE.games.find(g => g.id == sim.matchId);
            if (tournamentGame) {
                tournamentGame.home_score = sim.homeScore.toString();
                tournamentGame.away_score = sim.awayScore.toString();
                tournamentGame.finished = true; // Mark as finished
                tournamentGame.time_elapsed = 'finished';
                
                // Recalculate standings, update caches, and refresh UI
                processData(); 
                saveDataToCache();
                
                // Repopulate simulation dropdowns (to remove this game from upcoming ones)
                populateSimulatorDropdowns();
                
                // Recalculate and sync FantaMondiali points
                if (typeof syncFantaData === 'function') {
                    syncFantaData();
                }
            }
        }
        return;
    }

    // Roll for events
    // 1. Goal Roll (~1.8% chance per minute for home, ~1.6% chance for away, depending slightly on team rating or randomized)
    const homeGoalRate = 0.016;
    const awayGoalRate = 0.015;

    if (Math.random() < homeGoalRate) {
        scoreGoal('home');
    } else if (Math.random() < awayGoalRate) {
        scoreGoal('away');
    }

    // 2. Yellow Card Roll (1.1% chance)
    if (Math.random() < 0.011) {
        showCard('yellow');
    }

    // 3. Red Card Roll (0.07% chance)
    if (Math.random() < 0.0007) {
        showCard('red');
    }
}

function scoreGoal(side) {
    const sim = STATE.simulation;
    const team = side === 'home' ? sim.homeTeam : sim.awayTeam;
    const opponent = side === 'home' ? sim.awayTeam : sim.homeTeam;
    
    if (side === 'home') {
        sim.homeScore++;
    } else {
        sim.awayScore++;
    }

    // Update scoreboard
    DOM.simMatchScore.innerText = `${sim.homeScore} - ${sim.awayScore}`;

    // Pick dynamic scorer name
    const scorer = pickRandomPlayer(team.fifa_code);
    
    // Add to scorers list in HUD
    const scorerItem = document.createElement('div');
    scorerItem.className = 'sim-scorer-item';
    scorerItem.innerHTML = `<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10"></circle></svg> <span>${scorer} (${sim.time}')</span>`;
    
    if (side === 'home') {
        sim.homeScorers.push({ name: scorer, minute: sim.time });
        DOM.simHomeScorersList.appendChild(scorerItem);
    } else {
        sim.awayScorers.push({ name: scorer, minute: sim.time });
        DOM.simAwayScorersList.appendChild(scorerItem);
    }

    // Log match event with flash effect
    logSimEvent(sim.time, `⚽ GOOOL! ${team.name_en} segna! Rete di ${scorer}. (${sim.homeScore} - ${sim.awayScore})`, 'goal');
}

function showCard(color) {
    const sim = STATE.simulation;
    const side = Math.random() < 0.5 ? 'home' : 'away';
    const team = side === 'home' ? sim.homeTeam : sim.awayTeam;
    const player = pickRandomPlayer(team.fifa_code);
    
    const eventClass = color === 'yellow' ? 'card-yellow' : 'card-red';
    const cardSymbol = color === 'yellow' ? '🟨' : '🟥';
    const cardText = color === 'yellow' ? 'Cartellino Giallo' : 'Cartellino Rosso';

    logSimEvent(sim.time, `${cardSymbol} ${cardText} per ${player} (${team.name_en})`, eventClass);
}

function pickRandomPlayer(fifaCode) {
    const players = TEAM_PLAYERS[fifaCode] || ["Attaccante", "Centrocampista", "Difensore", "Attaccante", "Num. 10", "Centravanti"];
    const idx = Math.floor(Math.random() * players.length);
    return players[idx];
}

function logSimEvent(time, message, typeClass = '') {
    const row = document.createElement('div');
    row.className = `event-row ${typeClass}`;
    
    const timeHtml = typeClass !== 'system-msg' ? `<span class="event-time">${time}'</span>` : '';
    
    row.innerHTML = `
        ${timeHtml}
        <span class="event-desc">${message}</span>
    `;
    
    DOM.simEventList.insertBefore(row, DOM.simEventList.firstChild); // Prepend new events
}

function togglePauseSimulation() {
    const sim = STATE.simulation;
    if (!sim.timerId) return;

    sim.isPaused = !sim.isPaused;
    DOM.simPauseBtn.innerText = sim.isPaused ? 'Riprendi' : 'Pausa';
    logSimEvent(sim.time, sim.isPaused ? 'Partita in pausa.' : 'Partita ripresa.', 'system-msg');
}

function pauseTickerTemporarily(durationMs) {
    const sim = STATE.simulation;
    sim.isPaused = true;
    setTimeout(() => {
        if (sim.timerId) sim.isPaused = false; // Only resume if simulation wasn't stopped
    }, durationMs);
}

function stopMatchSimulation() {
    const sim = STATE.simulation;
    if (sim.timerId) {
        clearInterval(sim.timerId);
    }
    
    // Re-enable team select dropdowns
    if (DOM.simHomeTeam) DOM.simHomeTeam.disabled = false;
    if (DOM.simAwayTeam) DOM.simAwayTeam.disabled = false;
    if (DOM.simMatchSelect) DOM.simMatchSelect.value = '';

    // Reset simulation panel visibility
    DOM.simActivePanel.classList.add('hidden');
    DOM.simConfigPanel.classList.remove('hidden');
    DOM.simPauseBtn.classList.remove('hidden');
    DOM.simStopBtn.innerText = 'Termina Partita';
}


// 11. HELPER FUNCTIONS & FORMATTERS
function translateStage(stage) {
    const map = {
        'group': 'Fase a Gironi',
        'r32': 'Sedicesimi',
        'r16': 'Ottavi di Finale',
        'qf': 'Quarti di Finale',
        'sf': 'Semifinali',
        'third': 'Finale 3° Posto',
        'final': 'Finale'
    };
    return map[stage] || stage;
}

function formatGameDate(dateStr) {
    if (!dateStr) return '';
    // Format is MM/DD/YYYY HH:MM
    const matches = dateStr.match(/(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+)/);
    if (!matches) return dateStr;

    const [_, month, day, year, hour, minute] = matches;
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    
    return `${day} ${months[parseInt(month) - 1]} ${year} ${hour}:${minute}`;
}

function formatShortDate(dateStr) {
    if (!dateStr) return '';
    const matches = dateStr.match(/(\d+)\/(\d+)\/(\d+)/);
    if (!matches) return dateStr;
    const [_, month, day] = matches;
    return `${day}/${month}`;
}

function formatSimClock(minutes) {
    if (minutes < 45) {
        return `${minutes.toString().padStart(2, '0')}:00`;
    } else if (minutes === 45) {
        return `45:00`;
    } else if (minutes < 90) {
        return `${minutes.toString().padStart(2, '0')}:00`;
    } else {
        return `90:00`;
    }
}

// UPDATE FOOTER API INDICATOR
function updateApiStatusIndicator(status) {
    DOM.apiStatus.innerHTML = '';
    
    if (status === 'online') {
        DOM.apiStatus.innerHTML = `
            <span class="status-dot green animate-pulse"></span>
            <span>API Online</span>
        `;
    } else if (status === 'cache') {
        DOM.apiStatus.innerHTML = `
            <span class="status-dot green"></span>
            <span>API Online (Dati in Cache)</span>
        `;
    } else if (status === 'offline') {
        DOM.apiStatus.innerHTML = `
            <span class="status-dot yellow"></span>
            <span>Offline Fallback</span>
        `;
    } else {
        DOM.apiStatus.innerHTML = `
            <span class="status-dot red"></span>
            <span>Errore Dati</span>
        `;
    }
}

// SHOW LOADING STATE DURING FETCHES
function showLoadingStates() {
    const spinner = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Caricamento dati...</p>
        </div>
    `;
    DOM.matchesGrid.innerHTML = spinner;
    DOM.groupsStandingsGrid.innerHTML = spinner;
    DOM.teamsCardsGrid.innerHTML = spinner;
}

// SHOW ERROR STATE
function showErrorStates() {
    const errorMsg = `
        <div class="empty-state">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="red" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h4>Impossibile caricare i dati</h4>
            <p>Si è verificato un errore nel recupero delle informazioni sul torneo.</p>
        </div>
    `;
    DOM.matchesGrid.innerHTML = errorMsg;
    DOM.groupsStandingsGrid.innerHTML = errorMsg;
    DOM.teamsCardsGrid.innerHTML = errorMsg;
    updateApiStatusIndicator('error');
}

// TIMEZONE PARSING AND CALENDAR EXPORT HELPERS
function parseLocalDateInTimezone(dateStr, ianatz) {
    if (!dateStr) return null;
    const matches = dateStr.match(/(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+)/);
    if (!matches) return null;
    const [_, month, day, year, hour, minute] = matches;
    
    const isoStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
    const utcDate = new Date(isoStr + 'Z');
    
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: ianatz,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
        
        const parts = formatter.formatToParts(utcDate);
        const partVal = {};
        parts.forEach(p => partVal[p.type] = p.value);
        
        const wallDate = new Date(`${partVal.year}-${partVal.month}-${partVal.day}T${partVal.hour}:${partVal.minute}:${partVal.second}Z`);
        const diff = utcDate.getTime() - wallDate.getTime();
        return new Date(utcDate.getTime() + diff);
    } catch (e) {
        console.error("Timezone format conversion failed", e);
        return new Date(year, month - 1, day, hour, minute);
    }
}

function getTzAbbreviation(tz, date) {
    try {
        const parts = date.toLocaleDateString('it-IT', { day: 'numeric', timeZone: tz, timeZoneName: 'short' }).split(' ');
        return parts.pop();
    } catch (e) {
        return "";
    }
}

function exportMatchToCalendar(matchId) {
    const game = STATE.games.find(g => g.id == matchId);
    if (!game) return;

    const homeTeam = STATE.teamsMap[game.home_team_id];
    const awayTeam = STATE.teamsMap[game.away_team_id];
    const homeName = homeTeam ? homeTeam.name_en : (game.home_team_label || 'TBD');
    const awayName = awayTeam ? awayTeam.name_en : (game.away_team_label || 'TBD');
    const stadium = STATE.stadiumsMap[game.stadium_id];
    const stadiumName = stadium ? (stadium.name_en || stadium.name) : `Stadium ${game.stadium_id}`;

    const tz = STADIUM_TIMEZONES[game.stadium_id] || "America/New_York";
    const startDate = parseLocalDateInTimezone(game.local_date, tz) || new Date();
    const endDate = new Date(startDate.getTime() + 105 * 60 * 1000); // 105 minutes match window

    const formatICSDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Mondiali2026Widget//NONSGML v1.0//EN',
        'BEGIN:VEVENT',
        `UID:match-${game.id}@mondiali2026widget`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(startDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `SUMMARY:Mondiali 2026: ${homeName} vs ${awayName}`,
        `DESCRIPTION:Match ${game.id} - ${translateStage(game.type)} (Girone ${game.group})`,
        `LOCATION:${stadiumName}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mondiali_2026_match_${game.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export function to global window scope
window.exportMatchToCalendar = exportMatchToCalendar;

// 12. REAL-TIME POLLING AND GOAL NOTIFICATION SYSTEM
async function pollLiveUpdates() {
    // Only poll if we are not actively running a simulated match
    if (STATE.simulation.timerId && !STATE.simulation.isPaused) {
        return;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const gamesRes = await fetch('https://worldcup26.ir/get/games', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!gamesRes.ok) return;
        const gamesData = await gamesRes.json();
        const newGames = gamesData.games || gamesData;
        
        if (!Array.isArray(newGames) || newGames.length === 0) return;

        // Detect goal events in live matches
        detectGoals(newGames);
        
        // Update state
        STATE.games = newGames;
        
        // Re-render
        renderHeaderStats();
        renderLiveMatchesTicker();
        
        if (STATE.activeTab === 'partite') {
            renderMatchesGrid();
        } else if (STATE.activeTab === 'classifiche') {
            pollGroupsUpdates();
        } else if (STATE.activeTab === 'tabellone') {
            renderBracket();
        }

        // Also update open details modal if active
        updateModalLiveUpdates();
        
        // Sync FantaMondiali in the background (if cloud active or on the tab)
        if (STATE.fanta.isCloud || STATE.activeTab === 'scommesse') {
            syncFantaData();
        }
    } catch (e) {
        console.log('Live updates polling failed:', e);
    }
}

async function pollGroupsUpdates() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const groupsRes = await fetch('https://worldcup26.ir/get/groups', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!groupsRes.ok) return;
        const groupsData = await groupsRes.json();
        STATE.groups = groupsData.groups || groupsData;
        renderGroupsStandings();
    } catch(e) {
        console.log('Group standings polling failed:', e);
    }
}

function detectGoals(newGames) {
    newGames.forEach(newGame => {
        const oldGame = STATE.games.find(g => g.id == newGame.id);
        if (!oldGame) return;

        const oldHome = parseInt(oldGame.home_score) || 0;
        const oldAway = parseInt(oldGame.away_score) || 0;
        const newHome = parseInt(newGame.home_score) || 0;
        const newAway = parseInt(newGame.away_score) || 0;

        const homeTeam = STATE.teamsMap[newGame.home_team_id];
        const awayTeam = STATE.teamsMap[newGame.away_team_id];
        const homeName = homeTeam ? homeTeam.name_en : (newGame.home_team_label || 'TBD');
        const awayName = awayTeam ? awayTeam.name_en : (newGame.away_team_label || 'TBD');

        if (newHome > oldHome) {
            showGoalToast(newGame, homeName, { home: newHome, away: newAway });
        }
        if (newAway > oldAway) {
            showGoalToast(newGame, awayName, { home: newHome, away: newAway });
        }
    });
}

function showGoalToast(match, scoringTeam, newScore) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const homeTeam = STATE.teamsMap[match.home_team_id];
    const awayTeam = STATE.teamsMap[match.away_team_id];
    const homeName = homeTeam ? homeTeam.name_en : (match.home_team_label || 'TBD');
    const awayName = awayTeam ? awayTeam.name_en : (match.away_team_label || 'TBD');

    const toast = document.createElement('div');
    toast.className = 'goal-toast';
    toast.innerHTML = `
        <div class="toast-icon">⚽</div>
        <div class="toast-content">
            <div class="toast-title">GOOOL!</div>
            <div class="toast-body">Il <strong>${scoringTeam}</strong> ha segnato!</div>
            <div class="toast-score">${homeName} <strong>${newScore.home} - ${newScore.away}</strong> ${awayName}</div>
        </div>
    `;

    container.appendChild(toast);
    
    // Play celebratory sound
    playGoalSound();

    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 5000);
}

function playGoalSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4 -> E4 -> G4 -> C5 celebratory chord
        let startTime = audioCtx.currentTime;
        
        notes.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime + index * 0.1);
            
            gain.gain.setValueAtTime(0.12, startTime + index * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.1 + 0.25);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(startTime + index * 0.1);
            osc.stop(startTime + index * 0.1 + 0.25);
        });
    } catch (e) {
        console.warn('Audio context blocked or unsupported', e);
    }
}

// ==========================================
// FANTAMONDIALI (BETS / REMOTE GAME) ENGINE
// ==========================================

function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function saveDataToCache() {
    const cacheKey = 'worldcup2026_data';
    const cacheTimeKey = 'worldcup2026_data_time';
    localStorage.setItem(cacheKey, JSON.stringify({
        teams: STATE.teams,
        games: STATE.games,
        groups: STATE.groups,
        stadiums: STATE.stadiums
    }));
    localStorage.setItem(cacheTimeKey, Date.now().toString());
}

async function mongoFetch(action, payload) {
    const config = STATE.fanta.config;
    if (!config.endpoint || !config.apiKey) {
        throw new Error("Credenziali MongoDB non configurate.");
    }
    let baseUrl = config.endpoint.trim();
    if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
    }
    const url = `${baseUrl}${action}`;
    
    const headers = {
        'Content-Type': 'application/json',
        'api-key': config.apiKey,
        'Accept': 'application/json'
    };
    
    const body = {
        dataSource: config.dataSource.trim(),
        database: config.database.trim(),
        collection: 'players',
        ...payload
    };

    console.log(`[Mongo Data API] Requesting ${action} on collection players...`);

    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Data API Error ${res.status}: ${errText}`);
    }

    return await res.json();
}

async function testMongoConnection() {
    try {
        await mongoFetch('find', { limit: 1 });
        return true;
    } catch (e) {
        console.error("Test connection failed:", e);
        return false;
    }
}

function getLocalPlayers() {
    try {
        return JSON.parse(localStorage.getItem('fanta_players') || '[]');
    } catch(e) {
        console.error("Failed to parse local players", e);
        return [];
    }
}

function saveLocalPlayers(players) {
    localStorage.setItem('fanta_players', JSON.stringify(players));
}

async function syncFantaData() {
    if (STATE.fanta.isCloud) {
        updateDbStatus('connecting');
        try {
            const res = await mongoFetch('find', {});
            STATE.fanta.players = res.documents || [];
            updateDbStatus('connected');
        } catch (e) {
            console.error("Failed to fetch players from MongoDB:", e);
            updateDbStatus('error', e.message);
            // Fallback to local
            STATE.fanta.players = getLocalPlayers();
        }
    } else {
        updateDbStatus('local');
        STATE.fanta.players = getLocalPlayers();
    }

    populatePlayerSelect();
    updateLeaderboard();
    renderBetsMatches();
}

function updateDbStatus(status, message) {
    if (!DOM.dbConnStatus) return;
    const statusDot = DOM.dbConnStatus.querySelector('.status-dot');
    const statusText = DOM.dbConnStatus.querySelector('span:not(.status-dot)');
    
    // Reset classes
    statusDot.className = 'status-dot';
    DOM.dbConnStatus.classList.remove('connected');
    
    DOM.dbConnectBtn.classList.remove('hidden');
    DOM.dbDisconnectBtn.classList.add('hidden');
    
    if (status === 'connected') {
        statusDot.classList.add('green');
        DOM.dbConnStatus.classList.add('connected');
        statusText.textContent = 'MongoDB Atlas Collegato';
        DOM.dbConnectBtn.classList.add('hidden');
        DOM.dbDisconnectBtn.classList.remove('hidden');
        DOM.dbExplanationText.textContent = "Connesso a MongoDB Atlas. I pronostici e la classifica sono sincronizzati in tempo reale con la tua famiglia!";
    } else if (status === 'connecting') {
        statusDot.classList.add('yellow');
        statusText.textContent = 'Connessione in corso...';
        DOM.dbExplanationText.textContent = "Tentativo di connessione al database MongoDB Atlas in corso...";
    } else if (status === 'error') {
        statusDot.classList.add('red');
        statusText.textContent = 'Errore Connessione';
        DOM.dbExplanationText.innerHTML = `<span style="color:var(--danger-red)">Impossibile connettersi. Errore: ${message}</span>`;
    } else {
        // local
        statusDot.classList.add('yellow');
        statusText.textContent = 'Modalità Locale (Offline)';
        DOM.dbExplanationText.textContent = "I dati di gioco sono salvati sul tuo dispositivo. Clicca sull'icona delle impostazioni per connettere il tuo database MongoDB Atlas e giocare a distanza con la famiglia!";
    }
}

function populatePlayerSelect() {
    const select = DOM.activePlayerSelect;
    if (!select) return;
    
    const prevValue = select.value || STATE.fanta.activePlayerId;
    
    // Keep first option
    select.innerHTML = '<option value="">-- Seleziona Giocatore --</option>';
    
    STATE.fanta.players.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = p.name;
        if (p.name === prevValue) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    if (STATE.fanta.players.some(p => p.name === prevValue)) {
        STATE.fanta.activePlayerId = prevValue;
        DOM.activePlayerTag.textContent = `Giocatore: ${prevValue}`;
    } else {
        STATE.fanta.activePlayerId = '';
        DOM.activePlayerTag.textContent = 'Seleziona un giocatore';
    }
}

async function handleAddPlayer() {
    const input = DOM.createPlayerInput;
    if (!input) return;
    
    const name = input.value.trim();
    if (!name) {
        alert("Inserisci un nome valido.");
        return;
    }

    // Check duplicate name
    if (STATE.fanta.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        alert("Questo nome è già presente nel gioco.");
        return;
    }

    try {
        if (STATE.fanta.isCloud) {
            updateDbStatus('connecting', 'Salvataggio nuovo giocatore...');
            await mongoFetch('updateOne', {
                filter: { name: name },
                update: {
                    $setOnInsert: {
                        name: name,
                        points: 0,
                        bets: {}
                    }
                },
                upsert: true
            });
        } else {
            const players = getLocalPlayers();
            players.push({
                name: name,
                points: 0,
                bets: {}
            });
            saveLocalPlayers(players);
        }
        
        input.value = '';
        STATE.fanta.activePlayerId = name;
        await syncFantaData();
    } catch(e) {
        alert("Impossibile aggiungere il giocatore: " + e.message);
        syncFantaData();
    }
}

async function savePlayerBet(matchId) {
    const activePlayerName = STATE.fanta.activePlayerId;
    if (!activePlayerName) {
        alert("Seleziona prima un giocatore.");
        return;
    }

    const winSelect = document.getElementById(`bet-win-${matchId}`);
    const goalsInput = document.getElementById(`bet-goals-${matchId}`);
    if (!winSelect || !goalsInput) return;

    const winner = winSelect.value;
    const totalGoals = parseInt(goalsInput.value);
    
    if (isNaN(totalGoals) || totalGoals < 0) {
        alert("Inserisci un numero di gol valido (>= 0).");
        return;
    }

    try {
        if (STATE.fanta.isCloud) {
            updateDbStatus('connecting', 'Salvataggio pronostico...');
            await mongoFetch('updateOne', {
                filter: { name: activePlayerName },
                update: {
                    $set: {
                        [`bets.${matchId}`]: {
                            winner: winner,
                            totalGoals: totalGoals
                        }
                    }
                }
            });
        } else {
            const players = getLocalPlayers();
            const idx = players.findIndex(p => p.name === activePlayerName);
            if (idx !== -1) {
                if (!players[idx].bets) players[idx].bets = {};
                players[idx].bets[matchId] = {
                    winner: winner,
                    totalGoals: totalGoals
                };
                saveLocalPlayers(players);
            }
        }
        
        // Remove editing mode for this card
        STATE.fanta.editingMatchId = null;
        await syncFantaData();
    } catch(e) {
        alert("Impossibile salvare il pronostico: " + e.message);
        syncFantaData();
    }
}

function setBetEditMode(matchId, isEdit) {
    if (isEdit) {
        STATE.fanta.editingMatchId = matchId;
    } else {
        STATE.fanta.editingMatchId = null;
    }
    renderBetsMatches();
}

function calculateMatchPoints(game, players) {
    const actualHome = parseInt(game.home_score);
    const actualAway = parseInt(game.away_score);
    if (isNaN(actualHome) || isNaN(actualAway)) return {};

    const actualWinner = actualHome > actualAway ? 'home' : (actualHome < actualAway ? 'away' : 'draw');
    const actualTotal = actualHome + actualAway;

    // Find players with correct winner
    const correctPlayers = [];
    players.forEach(p => {
        const bet = p.bets && p.bets[game.id];
        if (!bet) return;
        
        const predWinner = bet.winner;
        const predTotal = parseInt(bet.totalGoals);
        if (isNaN(predTotal)) return;

        if (predWinner === actualWinner) {
            correctPlayers.push({
                player: p,
                distance: Math.abs(predTotal - actualTotal)
            });
        }
    });

    // Calculate distances
    const exactPlayers = correctPlayers.filter(cp => cp.distance === 0);
    const nonExactPlayers = correctPlayers.filter(cp => cp.distance > 0);

    // Sort non-exact players by distance
    const uniqueNonExactDistances = [...new Set(nonExactPlayers.map(cp => cp.distance))].sort((a, b) => a - b);

    const pointsMap = {};
    
    // All players default to 0 points for this match
    players.forEach(p => {
        pointsMap[p.name] = 0;
    });

    // Exact players get 6 points (3 for winner + 3 exact bonus)
    exactPlayers.forEach(cp => {
        pointsMap[cp.player.name] = 6;
    });

    // Non-exact players get points based on proximity
    nonExactPlayers.forEach(cp => {
        const rankIndex = uniqueNonExactDistances.indexOf(cp.distance);
        if (rankIndex === 0) {
            // 2nd closest
            pointsMap[cp.player.name] = 5; // 3 + 2
        } else if (rankIndex === 1) {
            // 3rd closest
            pointsMap[cp.player.name] = 4; // 3 + 1
        } else {
            // others
            pointsMap[cp.player.name] = 3; // 3 + 0
        }
    });

    return pointsMap;
}

function updateLeaderboard() {
    const players = STATE.fanta.players;
    const games = STATE.games;

    const playerPoints = {};
    players.forEach(p => {
        playerPoints[p.name] = {
            totalPoints: 0,
            details: {}
        };
    });

    // Loop through each finished match
    games.forEach(game => {
        const isFinished = game.finished === 'TRUE' || game.finished === true;
        if (!isFinished) return;

        const pointsMap = calculateMatchPoints(game, players);
        Object.keys(pointsMap).forEach(name => {
            if (playerPoints[name]) {
                playerPoints[name].totalPoints += pointsMap[name];
                playerPoints[name].details[game.id] = pointsMap[name];
            }
        });
    });

    // Update STATE.fanta.players with computed points
    players.forEach(p => {
        p.points = playerPoints[p.name] ? playerPoints[p.name].totalPoints : 0;
        p.pointsDetails = playerPoints[p.name] ? playerPoints[p.name].details : {};
    });

    // Sort players by points (descending)
    players.sort((a, b) => b.points - a.points);

    renderLeaderboard();
}

function renderLeaderboard() {
    const tbody = DOM.gameLeaderboardBody;
    if (!tbody) return;

    if (STATE.fanta.players.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="table-empty">Nessun giocatore registrato.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = STATE.fanta.players.map((p, index) => {
        let medal = '';
        if (index === 0) medal = '🥇 ';
        else if (index === 1) medal = '🥈 ';
        else if (index === 2) medal = '🥉 ';

        return `
            <tr>
                <td class="col-rank">${index + 1}</td>
                <td class="col-name">${medal}${escapeHTML(p.name)}</td>
                <td class="col-pts font-bold gold-text">${p.points}</td>
            </tr>
        `;
    }).join('');
}

function renderBetsMatches() {
    const listContainer = DOM.betsMatchesList;
    if (!listContainer) return;

    const activePlayerName = STATE.fanta.activePlayerId;
    if (!activePlayerName) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <h4>Nessun Giocatore Selezionato</h4>
                <p>Seleziona un giocatore dal menu in alto o creane uno nuovo per iniziare a inserire i tuoi pronostici.</p>
            </div>
        `;
        return;
    }

    const player = STATE.fanta.players.find(p => p.name === activePlayerName);
    if (!player) {
        listContainer.innerHTML = `<p class="table-empty">Giocatore non trovato.</p>`;
        return;
    }

    if (!STATE.games || STATE.games.length === 0) {
        listContainer.innerHTML = `<p class="table-empty">Nessuna partita disponibile per i pronostici.</p>`;
        return;
    }

    // Sort games chronologically
    const sortedGames = [...STATE.games].sort((a, b) => {
        const dateA = parseLocalDateInTimezone(a.local_date, STADIUM_TIMEZONES[a.stadium_id] || "America/New_York") || new Date(0);
        const dateB = parseLocalDateInTimezone(b.local_date, STADIUM_TIMEZONES[b.stadium_id] || "America/New_York") || new Date(0);
        return dateA - dateB;
    });

    listContainer.innerHTML = sortedGames.map(game => renderBetCard(game, player)).join('');
}

function renderBetCard(game, player) {
    const isFinished = game.finished === 'TRUE' || game.finished === true;
    const homeTeam = STATE.teamsMap[game.home_team_id];
    const awayTeam = STATE.teamsMap[game.away_team_id];
    const homeName = homeTeam ? homeTeam.name_en : (game.home_team_label || 'TBD');
    const awayName = awayTeam ? awayTeam.name_en : (game.away_team_label || 'TBD');
    const homeFlag = homeTeam ? homeTeam.flag : null;
    const awayFlag = awayTeam ? awayTeam.flag : null;

    const tz = STADIUM_TIMEZONES[game.stadium_id] || "America/New_York";
    const startDate = parseLocalDateInTimezone(game.local_date, tz);
    let dateStr = game.local_date;
    if (startDate) {
        dateStr = startDate.toLocaleString('it-IT', { 
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
        });
    }

    const bet = player.bets && player.bets[game.id];
    const hasBet = !!bet;

    let pointsDetailText = '';
    let badgeClass = 'points-none';
    let ptsEarned = 0;

    if (isFinished) {
        ptsEarned = player.pointsDetails && player.pointsDetails[game.id] !== undefined ? player.pointsDetails[game.id] : 0;
        if (ptsEarned === 6) {
            pointsDetailText = '+6 pt (Esatto)';
            badgeClass = 'points-high';
        } else if (ptsEarned === 5) {
            pointsDetailText = '+5 pt (2° Vicino)';
            badgeClass = 'points-med';
        } else if (ptsEarned === 4) {
            pointsDetailText = '+4 pt (3° Vicino)';
            badgeClass = 'points-med';
        } else if (ptsEarned === 3) {
            pointsDetailText = '+3 pt (Esito)';
            badgeClass = 'points-med';
        } else {
            pointsDetailText = '0 pt';
            badgeClass = 'points-none';
        }
    }

    const isEditing = STATE.fanta.editingMatchId === game.id || !hasBet;

    let formOrSavedHTML = '';

    if (isFinished) {
        const actualHome = parseInt(game.home_score) || 0;
        const actualAway = parseInt(game.away_score) || 0;
        
        let predictionInfo = '';
        if (hasBet) {
            let winText = '';
            if (bet.winner === 'home') winText = homeName;
            else if (bet.winner === 'away') winText = awayName;
            else winText = 'Pareggio';
            predictionInfo = `Pronostico: <strong>${winText}</strong> (${bet.totalGoals} Gol)`;
        } else {
            predictionInfo = `Nessun pronostico`;
        }

        formOrSavedHTML = `
            <div class="bet-result-summary">
                <div class="bet-info-vals">
                    <span class="bet-lbl">${predictionInfo}</span>
                    <span class="res-score">Risultato: ${actualHome} - ${actualAway}</span>
                </div>
                <span class="points-awarded-badge ${badgeClass}">${pointsDetailText}</span>
            </div>
        `;
    } else {
        if (isEditing) {
            formOrSavedHTML = `
                <div class="bet-card-form" id="bet-form-${game.id}">
                    <div class="input-item">
                        <label for="bet-win-${game.id}">Esito Vincente</label>
                        <select id="bet-win-${game.id}">
                            <option value="home" ${bet && bet.winner === 'home' ? 'selected' : ''}>Vittoria ${homeName}</option>
                            <option value="draw" ${bet && bet.winner === 'draw' ? 'selected' : ''}>Pareggio</option>
                            <option value="away" ${bet && bet.winner === 'away' ? 'selected' : ''}>Vittoria ${awayName}</option>
                        </select>
                    </div>
                    <div class="input-item">
                        <label for="bet-goals-${game.id}">Totale Gol</label>
                        <input type="number" id="bet-goals-${game.id}" min="0" max="20" value="${bet ? bet.totalGoals : '2'}">
                    </div>
                    <button class="bet-card-submit-btn" onclick="savePlayerBet('${game.id}')">Salva Pronostico</button>
                </div>
            `;
        } else {
            let winText = '';
            if (bet.winner === 'home') winText = homeName;
            else if (bet.winner === 'away') winText = awayName;
            else winText = 'Pareggio';

            formOrSavedHTML = `
                <div class="saved-bet-display" id="bet-saved-${game.id}">
                    <div class="bet-info-vals">
                        <span class="bet-lbl">Il tuo pronostico</span>
                        <span class="bet-val"><strong>${winText}</strong> (${bet.totalGoals} Gol)</span>
                    </div>
                    <button class="bet-edit-btn" onclick="setBetEditMode('${game.id}', true)">Modifica</button>
                </div>
            `;
        }
    }

    return `
        <div class="bet-card ${isFinished ? 'finished' : ''}">
            <div class="bet-card-header">
                <span>${translateStage(game.type)} &bull; Girone ${game.group || '-'}</span>
                <span>${dateStr}</span>
            </div>
            <div class="bet-card-teams">
                <div class="bet-team-row">
                    ${homeFlag ? `<img src="${homeFlag}" alt="" class="team-flag">` : `<div class="team-flag-placeholder">?</div>`}
                    <span>${homeName}</span>
                </div>
                <div class="bet-team-row">
                    ${awayFlag ? `<img src="${awayFlag}" alt="" class="team-flag">` : `<div class="team-flag-placeholder">?</div>`}
                    <span>${awayName}</span>
                </div>
            </div>
            ${formOrSavedHTML}
        </div>
    `;
}

function setupFantaMondiali() {
    if (!DOM.dbConnStatus) return; // Prevent errors if HTML is not loaded

    // DB Config Toggle
    DOM.dbSettingsToggleBtn.addEventListener('click', () => {
        DOM.dbConfigPanel.classList.toggle('hidden');
    });

    // Connect Button
    DOM.dbConnectBtn.addEventListener('click', async () => {
        const endpoint = DOM.mongoEndpoint.value.trim();
        const apiKey = DOM.mongoApiKey.value.trim();
        const dataSource = DOM.mongoDatasource.value.trim() || 'Cluster0';
        const database = DOM.mongoDatabase.value.trim() || 'fantamondiali';

        if (!endpoint || !apiKey) {
            alert("Compila tutti i campi richiesti (Endpoint URL e API Key).");
            return;
        }

        const oldConfig = { ...STATE.fanta.config };
        const oldIsCloud = STATE.fanta.isCloud;

        STATE.fanta.config = { endpoint, apiKey, dataSource, database };
        STATE.fanta.isCloud = true;

        updateDbStatus('connecting');

        const ok = await testMongoConnection();
        if (ok) {
            localStorage.setItem('fanta_mongo_endpoint', endpoint);
            localStorage.setItem('fanta_mongo_apikey', apiKey);
            localStorage.setItem('fanta_mongo_datasource', dataSource);
            localStorage.setItem('fanta_mongo_database', database);
            DOM.dbConfigPanel.classList.add('hidden');
            await syncFantaData();
        } else {
            alert("Connessione fallita. Verifica l'URL dell'endpoint e la tua API Key.");
            STATE.fanta.config = oldConfig;
            STATE.fanta.isCloud = oldIsCloud;
            syncFantaData();
        }
    });

    // Disconnect Button
    DOM.dbDisconnectBtn.addEventListener('click', () => {
        if (confirm("Sei sicuro di voler disconnettere MongoDB Atlas? Tornerai in modalità locale.")) {
            localStorage.removeItem('fanta_mongo_endpoint');
            localStorage.removeItem('fanta_mongo_apikey');
            localStorage.removeItem('fanta_mongo_datasource');
            localStorage.removeItem('fanta_mongo_database');
            
            DOM.mongoEndpoint.value = '';
            DOM.mongoApiKey.value = '';
            DOM.mongoDatasource.value = '';
            DOM.mongoDatabase.value = '';

            STATE.fanta.config = { endpoint: '', apiKey: '', dataSource: '', database: '' };
            STATE.fanta.isCloud = false;
            syncFantaData();
        }
    });

    // Create Player
    DOM.createPlayerBtn.addEventListener('click', handleAddPlayer);
    DOM.createPlayerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddPlayer();
    });

    // Active Player Select
    DOM.activePlayerSelect.addEventListener('change', (e) => {
        STATE.fanta.activePlayerId = e.target.value;
        if (STATE.fanta.activePlayerId) {
            DOM.activePlayerTag.textContent = `Giocatore: ${STATE.fanta.activePlayerId}`;
        } else {
            DOM.activePlayerTag.textContent = 'Seleziona un giocatore';
        }
        renderBetsMatches();
    });

    // Initial Load configuration
    const savedEndpoint = localStorage.getItem('fanta_mongo_endpoint') || '';
    const savedApiKey = localStorage.getItem('fanta_mongo_apikey') || '';
    const savedDataSource = localStorage.getItem('fanta_mongo_datasource') || '';
    const savedDatabase = localStorage.getItem('fanta_mongo_database') || '';

    if (savedEndpoint && savedApiKey) {
        STATE.fanta.config = {
            endpoint: savedEndpoint,
            apiKey: savedApiKey,
            dataSource: savedDataSource || 'Cluster0',
            database: savedDatabase || 'fantamondiali'
        };
        STATE.fanta.isCloud = true;
        DOM.mongoEndpoint.value = STATE.fanta.config.endpoint;
        DOM.mongoApiKey.value = STATE.fanta.config.apiKey;
        DOM.mongoDatasource.value = STATE.fanta.config.dataSource;
        DOM.mongoDatabase.value = STATE.fanta.config.database;
    } else {
        STATE.fanta.isCloud = false;
    }

    syncFantaData();
}

// Expose functions globally for HTML triggers
window.savePlayerBet = savePlayerBet;
window.setBetEditMode = setBetEditMode;
window.syncFantaData = syncFantaData;

// ==========================================
// TOURNAMENT BRACKET (TABELLONE) RENDERER
// ==========================================

function renderBracket() {
    const container = DOM.bracketContainer;
    if (!container) return;

    if (!STATE.games || STATE.games.length === 0) {
        container.innerHTML = `<p class="table-empty">Nessun dato disponibile per il tabellone.</p>`;
        return;
    }

    // Define column match IDs in connection order
    const r32Ids = [74, 77, 73, 75, 76, 78, 79, 80, 83, 84, 81, 82, 86, 88, 85, 87];
    const r16Ids = [89, 90, 91, 92, 93, 94, 95, 96];
    const qfIds = [97, 99, 98, 100];
    const sfIds = [101, 102];
    const finalId = 104;
    const thirdId = 103;

    const getMatches = (ids) => ids.map(id => STATE.games.find(g => g.id == id)).filter(Boolean);

    const r32Matches = getMatches(r32Ids);
    const r16Matches = getMatches(r16Ids);
    const qfMatches = getMatches(qfIds);
    const sfMatches = getMatches(sfIds);
    const finalMatch = STATE.games.find(g => g.id == finalId);
    const thirdMatch = STATE.games.find(g => g.id == thirdId);

    container.innerHTML = `
        <div class="bracket-grid">
            <!-- Column 1: Sedicesimi -->
            <div class="bracket-column round-r32">
                <div class="column-header">Sedicesimi di Finale</div>
                <div class="column-matches">
                    ${r32Matches.map(m => renderBracketMatchCard(m)).join('')}
                </div>
            </div>

            <!-- Column 2: Ottavi -->
            <div class="bracket-column round-r16">
                <div class="column-header">Ottavi di Finale</div>
                <div class="column-matches">
                    ${r16Matches.map(m => renderBracketMatchCard(m)).join('')}
                </div>
            </div>

            <!-- Column 3: Quarti -->
            <div class="bracket-column round-qf">
                <div class="column-header">Quarti di Finale</div>
                <div class="column-matches">
                    ${qfMatches.map(m => renderBracketMatchCard(m)).join('')}
                </div>
            </div>

            <!-- Column 4: Semifinali -->
            <div class="bracket-column round-sf">
                <div class="column-header">Semifinali</div>
                <div class="column-matches">
                    ${sfMatches.map(m => renderBracketMatchCard(m)).join('')}
                </div>
            </div>

            <!-- Column 5: Finali -->
            <div class="bracket-column round-finals">
                <div class="column-header">Finali</div>
                <div class="column-matches">
                    <div class="finals-container">
                        <div class="final-match-wrapper">
                            <span class="finals-label">🥇 Primo Posto</span>
                            ${finalMatch ? renderBracketMatchCard(finalMatch) : ''}
                        </div>
                        <div class="third-match-wrapper" style="margin-top: 40px;">
                            <span class="finals-label">🥉 Terzo Posto</span>
                            ${thirdMatch ? renderBracketMatchCard(thirdMatch) : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderBracketMatchCard(game) {
    if (!game) return '';
    
    const finishedVal = game.finished === 'TRUE' || game.finished === true;
    const isLive = isGameLive(game);
    
    const homeTeam = STATE.teamsMap[game.home_team_id];
    const awayTeam = STATE.teamsMap[game.away_team_id];
    
    const homeName = homeTeam ? homeTeam.name_en : (game.home_team_label || 'TBD');
    const awayName = awayTeam ? awayTeam.name_en : (game.away_team_label || 'TBD');
    const homeFlag = homeTeam ? homeTeam.flag : null;
    const awayFlag = awayTeam ? awayTeam.flag : null;

    const homeScore = finishedVal || isLive ? game.home_score : '-';
    const awayScore = finishedVal || isLive ? game.away_score : '-';

    // Winner classes
    let homeClass = '';
    let awayClass = '';
    if (finishedVal) {
        const hsVal = parseInt(game.home_score) || 0;
        const asVal = parseInt(game.away_score) || 0;
        if (hsVal > asVal) {
            homeClass = 'winner';
            awayClass = 'loser';
        } else if (asVal > hsVal) {
            awayClass = 'winner';
            homeClass = 'loser';
        }
    }

    let statusText = '';
    let statusClass = 'upcoming';
    if (isLive) {
        statusText = `LIVE • ${getGameDisplayTime(game)}`;
        statusClass = 'live';
    } else if (finishedVal) {
        statusText = 'FINITA';
        statusClass = 'finished';
    } else {
        statusText = game.local_date.split(' ')[0];
    }

    return `
        <div class="bracket-match-card ${isLive ? 'live' : ''} ${finishedVal ? 'finished' : ''}" data-game-id="${game.id}">
            <div class="bracket-match-header">
                <span class="match-badge ${statusClass}">${statusText}</span>
                <span class="match-num">Match ${game.id}</span>
            </div>
            <div class="bracket-match-teams">
                <div class="bracket-team-row ${homeClass}">
                    <div class="team-lbl">
                        ${homeFlag ? `<img src="${homeFlag}" alt="" class="bracket-flag">` : `<div class="bracket-flag-placeholder">?</div>`}
                        <span class="bracket-team-name" title="${homeName}">${homeName}</span>
                    </div>
                    <span class="bracket-score">${homeScore}</span>
                </div>
                <div class="bracket-team-row ${awayClass}">
                    <div class="team-lbl">
                        ${awayFlag ? `<img src="${awayFlag}" alt="" class="bracket-flag">` : `<div class="bracket-flag-placeholder">?</div>`}
                        <span class="bracket-team-name" title="${awayName}">${awayName}</span>
                    </div>
                    <span class="bracket-score">${awayScore}</span>
                </div>
            </div>
        </div>
    `;
}

window.renderBracket = renderBracket;

// ==========================================
// SQUAD DATABASE & DETERMINISTIC LINEUP GENERATOR
// ==========================================

const FORMATION_COORDS = {
    "4-3-3": [
        [50, 90], // GK
        [85, 72], // RB
        [60, 75], // RCB
        [40, 75], // LCB
        [15, 72], // LB
        [70, 48], // RCM
        [50, 56], // DM
        [30, 48], // LCM
        [80, 22], // RW
        [50, 16], // ST
        [20, 22]  // LW
    ],
    "4-4-2": [
        [50, 90], // GK
        [85, 72], // RB
        [60, 75], // RCB
        [40, 75], // LCB
        [15, 72], // LB
        [82, 48], // RM
        [60, 52], // RCM
        [40, 52], // LCM
        [18, 48], // LM
        [60, 18], // RS
        [40, 18]  // LS
    ],
    "3-5-2": [
        [50, 90], // GK
        [70, 75], // RCB
        [50, 78], // CB
        [30, 75], // LCB
        [85, 52], // RWB
        [65, 48], // RCM
        [50, 58], // DM
        [35, 48], // LCM
        [15, 52], // LWB
        [60, 18], // RS
        [40, 18]  // LS
    ],
    "4-2-3-1": [
        [50, 90], // GK
        [85, 72], // RB
        [60, 75], // RCB
        [40, 75], // LCB
        [15, 72], // LB
        [62, 58], // RDM
        [38, 58], // LDM
        [75, 36], // RAM
        [50, 38], // AM
        [25, 36], // LAM
        [50, 16]  // ST
    ],
    "5-3-2": [
        [50, 90], // GK
        [86, 68], // RWB
        [65, 76], // RCB
        [50, 78], // CB
        [35, 76], // LCB
        [14, 68], // LWB
        [70, 48], // RCM
        [50, 54], // DM
        [30, 48], // LCM
        [60, 18], // RS
        [40, 18]  // LS
    ]
};

const SQUADS_DB = {
    "1": [ // Mexico
        ["Ochoa", "GK"], ["Montes", "D"], ["Vázquez", "D"], ["Sánchez", "D"], ["Gallardo", "D"],
        ["Álvarez", "M"], ["Chávez", "M"], ["Pineda", "M"], ["Sánchez", "M"], ["Lozano", "F"],
        ["Giménez", "F"], ["Malagón", "GK"], ["Araujo", "D"], ["Romo", "M"], ["Quiñones", "F"],
        ["Antuna", "F"], ["Martín", "F"]
    ],
    "2": [ // South Africa
        ["Williams", "GK"], ["Mudau", "D"], ["Kekana", "D"], ["Mvuala", "D"], ["Modiba", "D"],
        ["Mokoena", "M"], ["Sithole", "M"], ["Zwane", "M"], ["Tau", "F"], ["Morena", "F"],
        ["Makgopa", "F"], ["Goss", "GK"], ["Sibisi", "D"], ["Monare", "M"], ["Mayambela", "F"]
    ],
    "3": [ // South Korea
        ["Jo Hyeon-woo", "GK"], ["Kim Min-jae", "D"], ["Kim Young-gwon", "D"], ["Seol Young-woo", "D"], ["Kim Jin-su", "D"],
        ["Hwang In-beom", "M"], ["Park Yong-woo", "M"], ["Lee Jae-sung", "M"], ["Lee Kang-in", "F"], ["Son Heung-min", "F"],
        ["Hwang Hee-chan", "F"], ["Song Bum-keun", "GK"], ["Jung Seung-hyun", "D"], ["Hong Hyun-seok", "M"], ["Cho Gue-sung", "F"]
    ],
    "4": [ // Czech Republic
        ["Staněk", "GK"], ["Holeš", "D"], ["Hranáč", "D"], ["Krejčí", "D"], ["Coufal", "D"],
        ["Souček", "M"], ["Provod", "M"], ["Barák", "M"], ["Douděra", "M"], ["Schick", "F"],
        ["Kuchta", "F"], ["Kovář", "GK"], ["Zima", "D"], ["Sadílek", "M"], ["Hložek", "F"]
    ],
    "5": [ // Canada
        ["Crépeau", "GK"], ["Johnston", "D"], ["Miller", "D"], ["Bombito", "D"], ["Davies", "D"],
        ["Kone", "M"], ["Eustáquio", "M"], ["Buchanan", "M"], ["Millar", "M"], ["David", "F"],
        ["Larin", "F"], ["St. Clair", "GK"], ["Laryea", "D"], ["Osorio", "M"], ["Brym", "F"]
    ],
    "6": [ // Bosnia and Herzegovina
        ["Vasilj", "GK"], ["Ahmedhodžić", "D"], ["Hadžikadunić", "D"], ["Kolašinac", "D"], ["Gazibegović", "D"],
        ["Krunić", "M"], ["Tahirović", "M"], ["Hajradinović", "M"], ["Demirović", "F"], ["Džeko", "F"],
        ["Tabaković", "F"], ["Pirić", "GK"], ["Radeljić", "D"], ["Bašić", "M"], ["Varešanović", "F"]
    ],
    "7": [ // Qatar
        ["Barsham", "GK"], ["Mendes", "D"], ["Khoder", "D"], ["Mukhtar", "D"], ["Waad", "D"],
        ["Fathy", "M"], ["Gaber", "M"], ["Al-Haydos", "M"], ["Afif", "F"], ["Ali", "F"],
        ["Abdurisag", "F"], ["Al-Sheeb", "GK"], ["Salman", "D"], ["Hatkem", "M"], ["Alaaeldin", "F"]
    ],
    "8": [ // Switzerland
        ["Sommer", "GK"], ["Akanji", "D"], ["Schär", "D"], ["Rodriguez", "D"], ["Widmer", "D"],
        ["Xhaka", "M"], ["Freuler", "M"], ["Zakaria", "M"], ["Shaqiri", "F"], ["Embolo", "F"],
        ["Vargas", "F"], ["Kobel", "GK"], ["Elvedi", "D"], ["Sow", "M"], ["Amdouni", "F"],
        ["Okafor", "F"], ["Ndoye", "F"]
    ],
    "9": [ // Brazil
        ["Alisson", "GK"], ["Marquinhos", "D"], ["Militão", "D"], ["Danilo", "D"], ["Arana", "D"],
        ["Guimarães", "M"], ["Gomes", "M"], ["Paquetá", "M"], ["Rodrygo", "F"], ["Vinícius Jr", "F"],
        ["Endrick", "F"], ["Ederson", "GK"], ["Bremer", "D"], ["Beraldo", "D"], ["Douglas Luiz", "M"],
        ["Raphinha", "F"], ["Martinelli", "F"], ["Savinho", "F"]
    ],
    "10": [ // Morocco
        ["Bounou", "GK"], ["Hakimi", "D"], ["Aguerd", "D"], ["Saïss", "D"], ["Mazraoui", "D"],
        ["Amrabat", "M"], ["Ounahi", "M"], ["Ziyech", "M"], ["Díaz", "M"], ["En-Nesyri", "F"],
        ["Adli", "F"], ["El Kajoui", "GK"], ["Chibi", "D"], ["Richardson", "M"], ["El Kaabi", "F"],
        ["Rahimi", "F"]
    ],
    "13": [ // USA
        ["Turner", "GK"], ["Dest", "D"], ["Richards", "D"], ["Ream", "D"], ["Robinson", "D"],
        ["Adams", "M"], ["McKennie", "M"], ["Musah", "M"], ["Reyna", "M"], ["Pulisic", "F"],
        ["Balogun", "F"], ["Horvath", "GK"], ["Carter-Vickers", "D"], ["Cardoso", "M"], ["Weah", "F"],
        ["Pepi", "F"], ["Wright", "F"]
    ],
    "15": [ // Australia
        ["Ryan", "GK"], ["Souttar", "D"], ["Rowles", "D"], ["Atkinson", "D"], ["Behich", "D"],
        ["Irvine", "M"], ["Metcalfe", "M"], ["McGree", "M"], ["Boyle", "F"], ["Duke", "F"],
        ["Goodwin", "F"], ["Gauci", "GK"], ["Burgess", "D"], ["Baccus", "M"], ["Irankunda", "F"]
    ],
    "16": [ // Turkey
        ["Günok", "GK"], ["Demiral", "D"], ["Bardakcı", "D"], ["Müldür", "D"], ["Kadıoğlu", "D"],
        ["Çalhanoğlu", "M"], ["Özcan", "M"], ["Kökçü", "M"], ["Güler", "M"], ["Yılmaz", "F"],
        ["Yıldız", "F"], ["Çakır", "GK"], ["Çelik", "D"], ["Yazıcı", "M"], ["Aktürkoğlu", "F"]
    ],
    "17": [ // Germany
        ["Ter Stegen", "GK"], ["Rüdiger", "D"], ["Tah", "D"], ["Kimmich", "D"], ["Mittelstädt", "D"],
        ["Andrich", "M"], ["Kroos", "M"], ["Gündoğan", "M"], ["Musiala", "F"], ["Wirtz", "F"],
        ["Havertz", "F"], ["Neuer", "GK"], ["Schlotterbeck", "D"], ["Gross", "M"], ["Sané", "F"],
        ["Füllkrug", "F"], ["Undav", "F"]
    ],
    "20": [ // Ecuador
        ["Domínguez", "GK"], ["Hincapié", "D"], ["Pacho", "D"], ["Torres", "D"], ["Preciado", "D"],
        ["Caicedo", "M"], ["Gruezo", "M"], ["Páez", "M"], ["Ortiz", "M"], ["Valencia", "F"],
        ["Sarmiento", "F"], ["Ramírez", "GK"], ["Arboleda", "D"], ["Franco", "M"], ["Rodriguez", "F"]
    ],
    "21": [ // Netherlands
        ["Verbruggen", "GK"], ["Van Dijk", "D"], ["De Vrij", "D"], ["Dumfries", "D"], ["Aké", "D"],
        ["Schouten", "M"], ["Reijnders", "M"], ["Simons", "M"], ["Frimpong", "M"], ["Depay", "F"],
        ["Gakpo", "F"], ["Bijlow", "GK"], ["De Ligt", "D"], ["Van de Ven", "D"], ["Wijnaldum", "M"],
        ["Weghorst", "F"], ["Malen", "F"]
    ],
    "22": [ // Japan
        ["Suzuki", "GK"], ["Itakura", "D"], ["Taniguchi", "D"], ["Machida", "D"], ["Sugawara", "D"],
        ["Endo", "M"], ["Morita", "M"], ["Kubo", "M"], ["Minamino", "M"], ["Doan", "F"],
        ["Ueda", "F"], ["Maekawa", "GK"], ["Tomiyasu", "D"], ["Kamada", "M"], ["Mitoma", "F"],
        ["Maeda", "F"], ["Asano", "F"]
    ],
    "25": [ // Belgium
        ["Casteels", "GK"], ["Faes", "D"], ["Vertonghen", "D"], ["Castagne", "D"], ["Theate", "D"],
        ["Onana", "M"], ["Mangala", "M"], ["De Bruyne", "M"], ["Trossard", "F"], ["Doku", "F"],
        ["Lukaku", "F"], ["Kaminski", "GK"], ["Debast", "D"], ["Tielemans", "M"], ["Bakayoko", "F"],
        ["Carrasco", "F"], ["Openda", "F"]
    ],
    "26": [ // Egypt
        ["El Shenawy", "GK"], ["Hegazi", "D"], ["Abdelmonem", "D"], ["Hany", "D"], ["Hamdi", "D"],
        ["Elneny", "M"], ["Fathi", "M"], ["Ashour", "M"], ["Salah", "F"], ["Marmoush", "F"],
        ["Mostafa", "F"], ["Abou Gabal", "GK"], ["Gababr", "D"], ["Trezeguet", "F"], ["Sherif", "F"]
    ],
    "29": [ // Spain
        ["Unai Simón", "GK"], ["Le Normand", "D"], ["Laporte", "D"], ["Carvajal", "D"], ["Cucurella", "D"],
        ["Rodri", "M"], ["Fabián Ruiz", "M"], ["Pedri", "M"], ["Yamal", "F"], ["Nico Williams", "F"],
        ["Morata", "F"], ["Raya", "GK"], ["Vivian", "D"], ["Grimaldo", "D"], ["Zubimendi", "M"],
        ["Dani Olmo", "M"], ["Merino", "M"], ["Joselu", "F"], ["Oyarzabal", "F"]
    ],
    "32": [ // Uruguay
        ["Rochet", "GK"], ["Araújo", "D"], ["Giménez", "D"], ["Nández", "D"], ["Olivera", "D"],
        ["Valverde", "M"], ["Ugarte", "M"], ["Bentancur", "M"], ["Pellistri", "F"], ["Araújo", "F"],
        ["Núñez", "F"], ["Mele", "GK"], ["Cáceres", "D"], ["De la Cruz", "M"], ["Suárez", "F"],
        ["Rodríguez", "F"]
    ],
    "33": [ // France
        ["Maignan", "GK"], ["Saliba", "D"], ["Upamecano", "D"], ["Koundé", "D"], ["Theo Hernández", "D"],
        ["Kanté", "M"], ["Tchouaméni", "M"], ["Rabiot", "M"], ["Dembélé", "F"], ["Mbappé", "F"],
        ["Barcola", "F"], ["Samba", "GK"], ["Konaté", "D"], ["Mendy", "D"], ["Camavinga", "M"],
        ["Griezmann", "M"], ["Fofana", "M"], ["Giroud", "F"], ["Thuram", "F"], ["Coman", "F"]
    ],
    "34": [ // Senegal
        ["Mendy", "GK"], ["Koulibaly", "D"], ["Diallo", "D"], ["Sabaly", "D"], ["Jakobs", "D"],
        ["Gueye", "M"], ["Kouyaté", "M"], ["Camara", "M"], ["Mané", "F"], ["Sarr", "F"],
        ["Jackson", "F"], ["Gomis", "GK"], ["Seck", "D"], ["Ciss", "M"], ["Ndiaye", "F"]
    ],
    "36": [ // Norway
        ["Nyland", "GK"], ["Ajer", "D"], ["Østigård", "D"], ["Ryerson", "D"], ["Wolfe", "D"],
        ["Berge", "M"], ["Thorsby", "M"], ["Ødegaard", "M"], ["Bobb", "F"], ["Haaland", "F"],
        ["Sørloth", "F"], ["Dyngeland", "GK"], ["Hanche-Olsen", "D"], ["Patrick Berg", "M"], ["Nusa", "F"]
    ],
    "37": [ // Argentina
        ["E. Martínez", "GK"], ["Romero", "D"], ["Otamendi", "D"], ["Molina", "D"], ["Tagliafico", "D"],
        ["De Paul", "M"], ["Fernández", "M"], ["Mac Allister", "M"], ["Messi", "F"], ["J. Álvarez", "F"],
        ["L. Martínez", "F"], ["Armani", "GK"], ["L. Martínez", "D"], ["Montiel", "D"], ["Paredes", "M"],
        ["Lo Celso", "M"], ["Di María", "F"], ["Garnacho", "F"], ["N. González", "F"]
    ],
    "41": [ // Portugal
        ["Diogo Costa", "GK"], ["Rúben Dias", "D"], ["Pepe", "D"], ["Cancelo", "D"], ["Nuno Mendes", "D"],
        ["Palhinha", "M"], ["Vitinha", "M"], ["Bruno Fernandes", "M"], ["Bernardo Silva", "F"], ["Cristiano Ronaldo", "F"],
        ["Rafael Leão", "F"], ["José Sá", "GK"], ["Antonio Silva", "D"], ["Dalot", "D"], ["Neves", "M"],
        ["Otávio", "M"], ["Félix", "F"], ["Jota", "F"], ["Conceição", "F"]
    ],
    "44": [ // Colombia
        ["Vargas", "GK"], ["Cuesta", "D"], ["Sánchez", "D"], ["Muñoz", "D"], ["Mojica", "D"],
        ["Lerma", "M"], ["Ríos", "M"], ["James Rodríguez", "M"], ["Arias", "F"], ["Luis Díaz", "F"],
        ["Borré", "F"], ["Ospina", "GK"], ["Mina", "D"], ["Uribe", "M"], ["Sinisterra", "F"],
        ["Durán", "F"]
    ],
    "45": [ // England
        ["Pickford", "GK"], ["Stones", "D"], ["Guéhi", "D"], ["Walker", "D"], ["Trippier", "D"],
        ["Rice", "M"], ["Mainoo", "M"], ["Bellingham", "M"], ["Saka", "F"], ["Kane", "F"],
        ["Foden", "F"], ["Ramsdale", "GK"], ["Konsa", "D"], ["Alexander-Arnold", "D"], ["Gallagher", "M"],
        ["Palmer", "F"], ["Watkins", "F"], ["Toney", "F"], ["Gordon", "F"]
    ],
    "46": [ // Croatia
        ["Livaković", "GK"], ["Šutalo", "D"], ["Pongračić", "D"], ["Stanišić", "D"], ["Gvardiol", "D"],
        ["Modrić", "M"], ["Kovačić", "M"], ["Brozović", "M"], ["Majer", "F"], ["Kramarić", "F"],
        ["Budimir", "F"], ["Ivušić", "GK"], ["Erlić", "D"], ["Pašalić", "M"], ["Perišić", "F"]
    ]
};

const REGIONAL_SURNAMES = {
    "latam": ["Rodríguez", "González", "Gómez", "Fernández", "López", "Díaz", "Martínez", "Pérez", "García", "Sánchez", "Romero", "Torres", "Ruiz"],
    "europe": ["Smith", "Jones", "Miller", "Müller", "Novák", "Kowalski", "Ivanov", "Gruber", "Melnyk", "Hansen", "Silva", "García", "Martin", "Rossi"],
    "africa": ["Koulibaly", "Mensa", "Touré", "Diallo", "Traoré", "Keita", "Sow", "Diagne", "Bamba", "Okocha", "Mokoena", "Zwane", "Williams"],
    "asia": ["Kim", "Lee", "Park", "Choi", "Jung", "Wang", "Zhang", "Li", "Suzuki", "Sato", "Tanaka", "Takahashi", "Watanabe", "Al-Fardan"]
};

// Seeded random number generator
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Seeded shuffle array
function seededShuffle(array, seed) {
    let m = array.length, t, i;
    let currentSeed = seed;
    while (m) {
        currentSeed += 1;
        i = Math.floor(seededRandom(currentSeed) * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function getTeamRegion(teamId) {
    const id = parseInt(teamId);
    if ([1, 5, 11, 14, 18, 20, 30, 32, 37, 44, 48].includes(id)) return "latam";
    if ([4, 6, 8, 12, 16, 17, 21, 23, 25, 29, 36, 39, 41, 45, 46].includes(id)) return "europe";
    if ([2, 10, 19, 24, 26, 31, 34, 38, 42, 47].includes(id)) return "africa";
    return "asia"; // Default
}

function generateLineup(teamId, matchId, formation) {
    let roster = SQUADS_DB[teamId];
    
    // Fallback: generate roster dynamically
    if (!roster || roster.length === 0) {
        roster = [];
        const region = getTeamRegion(teamId);
        const firstNames = {
            "latam": ["Juan", "Carlos", "Luis", "José", "Mateo", "Santiago", "Sebastián", "Diego", "Alejandro", "Felipe", "Alexis", "Enzo", "Lautaro", "Cristian", "Rodrigo"],
            "europe": ["John", "Thomas", "Michael", "Lukas", "Jan", "Peter", "David", "Robert", "Marc", "Daniel", "Kevin", "Oliver", "Harry", "Jack", "Sven"],
            "africa": ["Moussa", "Aboubakar", "Kofi", "Sadio", "Youssef", "Samuel", "Ibrahim", "Amadou", "Didier", "Victor", "Idrissa", "Salif", "Cheikh", "Habib", "Kalidou"],
            "asia": ["Ji-sung", "Hao", "Kenji", "Akira", "Yusuf", "Hiroshi", "Min-woo", "Ahmed", "Tariq", "Ali", "Reza", "Sardar", "Mehdi", "Koji", "Jun"]
        }[region];
        
        const surnames = REGIONAL_SURNAMES[region];
        
        // Generate 1 GK, 6 D, 6 M, 5 F
        let seed = parseInt(teamId) * 100;
        
        // GK
        roster.push([firstNames[Math.floor(seededRandom(seed++) * firstNames.length)] + " " + surnames[Math.floor(seededRandom(seed++) * surnames.length)], "GK"]);
        
        // Defenders
        for (let i = 0; i < 6; i++) {
            roster.push([firstNames[Math.floor(seededRandom(seed++) * firstNames.length)] + " " + surnames[Math.floor(seededRandom(seed++) * surnames.length)], "D"]);
        }
        
        // Midfielders
        for (let i = 0; i < 6; i++) {
            roster.push([firstNames[Math.floor(seededRandom(seed++) * firstNames.length)] + " " + surnames[Math.floor(seededRandom(seed++) * surnames.length)], "M"]);
        }
        
        // Forwards
        for (let i = 0; i < 5; i++) {
            roster.push([firstNames[Math.floor(seededRandom(seed++) * firstNames.length)] + " " + surnames[Math.floor(seededRandom(seed++) * surnames.length)], "F"]);
        }
    }
    
    // Separate by roles
    const gks = roster.filter(p => p[1] === "GK").map(p => p[0]);
    const defs = roster.filter(p => p[1] === "D").map(p => p[0]);
    const mids = roster.filter(p => p[1] === "M").map(p => p[0]);
    const fwds = roster.filter(p => p[1] === "F").map(p => p[0]);
    
    // Seeded shuffle to make them variable across matches
    const seedShift = parseInt(matchId);
    const shuffledGks = seededShuffle([...gks], seedShift);
    const shuffledDefs = seededShuffle([...defs], seedShift + 1);
    const shuffledMids = seededShuffle([...mids], seedShift + 2);
    const shuffledFwds = seededShuffle([...fwds], seedShift + 3);
    
    // Formations mappings
    const FORMATION_POSITIONS = {
        "4-3-3": [
            ["GK", "GK"], ["RB", "D"], ["RCB", "D"], ["LCB", "D"], ["LB", "D"],
            ["RCM", "M"], ["DM", "M"], ["LCM", "M"], ["RW", "F"], ["ST", "F"], ["LW", "F"]
        ],
        "4-4-2": [
            ["GK", "GK"], ["RB", "D"], ["RCB", "D"], ["LCB", "D"], ["LB", "D"],
            ["RM", "M"], ["RCM", "M"], ["LCM", "M"], ["LM", "M"], ["RS", "F"], ["LS", "F"]
        ],
        "3-5-2": [
            ["GK", "GK"], ["RCB", "D"], ["CB", "D"], ["LCB", "D"], ["RWB", "M"],
            ["RCM", "M"], ["DM", "M"], ["LCM", "M"], ["LWB", "M"], ["RS", "F"], ["LS", "F"]
        ],
        "4-2-3-1": [
            ["GK", "GK"], ["RB", "D"], ["RCB", "D"], ["LCB", "D"], ["LB", "D"],
            ["RDM", "M"], ["LDM", "M"], ["RAM", "M"], ["AM", "M"], ["LAM", "M"], ["ST", "F"]
        ],
        "5-3-2": [
            ["GK", "GK"], ["RWB", "D"], ["RCB", "D"], ["CB", "D"], ["LCB", "D"],
            ["LWB", "D"], ["RCM", "M"], ["DM", "M"], ["LCM", "M"], ["RS", "F"], ["LS", "F"]
        ]
    };
    
    const positions = FORMATION_POSITIONS[formation] || FORMATION_POSITIONS["4-3-3"];
    const coordsList = FORMATION_COORDS[formation] || FORMATION_COORDS["4-3-3"];
    
    const starters = [];
    let gkIdx = 0, defIdx = 0, midIdx = 0, fwdIdx = 0;
    
    positions.forEach((posInfo, idx) => {
        const role = posInfo[1];
        let name = "Giocatore";
        if (role === "GK") {
            name = shuffledGks[gkIdx++] || (gks[0] || "Portiere");
        } else if (role === "D") {
            name = shuffledDefs[defIdx++] || (defs[0] || "Difensore");
        } else if (role === "M") {
            name = shuffledMids[midIdx++] || (mids[0] || "Centrocampista");
        } else if (role === "F") {
            name = shuffledFwds[fwdIdx++] || (fwds[0] || "Attaccante");
        }
        
        starters.push({
            name: name,
            coords: coordsList[idx]
        });
    });
    
    return starters;
}

function renderPitchLineup(lineup, isAway) {
    const jerseyClass = isAway ? 'away-jersey' : 'home-jersey';
    return lineup.map((player, idx) => {
        const left = player.coords[0];
        const top = player.coords[1];
        return `
            <div class="player-node" style="left: ${left}%; top: ${top}%;">
                <div class="player-jersey ${jerseyClass}">${idx + 1}</div>
                <div class="player-name">${player.name}</div>
            </div>
        `;
    }).join('');
}

function parseScorers(scorersStr, teamName, isAway) {
    if (!scorersStr || scorersStr === 'null') return [];
    
    let list = [];
    try {
        let cleaned = scorersStr;
        if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
            cleaned = '[' + cleaned.slice(1, -1) + ']';
        }
        cleaned = cleaned.replace(/“/g, '"').replace(/”/g, '"');
        list = JSON.parse(cleaned);
    } catch (e) {
        if (scorersStr.includes(',') || scorersStr.includes('"')) {
            list = scorersStr.replace(/[\{\}\"]/g, '').split(',').map(s => s.trim());
        } else {
            list = [scorersStr];
        }
    }
    
    return list.map(item => {
        const match = item.match(/(.*?)\s+(\d+)'/);
        let name = item;
        let minute = 0;
        if (match) {
            name = match[1];
            minute = parseInt(match[2]);
        } else {
            const numMatch = item.match(/\d+/);
            if (numMatch) minute = parseInt(numMatch[0]);
        }
        return {
            name: name,
            minute: minute,
            team: teamName,
            isAway: isAway,
            type: 'goal'
        };
    });
}

function openMatchDetails(gameId) {
    const game = STATE.games.find(g => g.id == gameId);
    if (!game) return;

    const modal = document.getElementById('match-details-modal');
    const body = document.getElementById('match-details-modal-body');
    if (!modal || !body) return;

    modal.setAttribute('data-game-id', gameId);

    const finishedVal = game.finished === 'TRUE' || game.finished === true;
    const isLive = isGameLive(game);

    const homeTeam = STATE.teamsMap[game.home_team_id];
    const awayTeam = STATE.teamsMap[game.away_team_id];

    const homeName = homeTeam ? homeTeam.name_en : (game.home_team_label || 'TBD');
    const awayName = awayTeam ? awayTeam.name_en : (game.away_team_label || 'TBD');
    const homeFlag = homeTeam ? homeTeam.flag : null;
    const awayFlag = awayTeam ? awayTeam.flag : null;

    const homeScore = finishedVal || isLive ? game.home_score : '-';
    const awayScore = finishedVal || isLive ? game.away_score : '-';

    let statusText = formatGameDate(game.local_date);
    let statusClass = 'upcoming';
    if (isLive && !finishedVal) {
        statusText = `LIVE • ${getGameDisplayTime(game)}`;
        statusClass = 'live';
    } else if (finishedVal) {
        statusText = 'FINITA';
        statusClass = 'finished';
    }

    const stadium = STATE.stadiumsMap[game.stadium_id];
    const stadiumName = stadium ? (stadium.name_en || stadium.name) : `Stadium ${game.stadium_id}`;
    const stadiumCity = stadium ? stadium.city_en : 'N/A';
    const stadiumCountry = stadium ? stadium.country_en : 'N/A';
    const stadiumCapacity = stadium ? (stadium.capacity ? stadium.capacity.toLocaleString() : 'N/A') : 'N/A';

    // Formations
    const formations = ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1", "5-3-2"];
    const homeSeed = parseInt(game.id) * 31;
    const awaySeed = parseInt(game.id) * 37;
    const homeFormation = formations[Math.floor(seededRandom(homeSeed) * formations.length)];
    const awayFormation = formations[Math.floor(seededRandom(awaySeed) * formations.length)];

    const homeLineup = generateLineup(game.home_team_id, homeSeed, homeFormation);
    const awayLineup = generateLineup(game.away_team_id, awaySeed, awayFormation);

    // Parse scorers
    const homeEvents = parseScorers(game.home_scorers, homeName, false);
    const awayEvents = parseScorers(game.away_scorers, awayName, true);
    const allEvents = [...homeEvents, ...awayEvents].sort((a, b) => a.minute - b.minute);

    let eventsHtml = '';
    if (allEvents.length === 0) {
        eventsHtml = `<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; font-style: italic; margin-top: 15px;">Nessun evento registrato per questo incontro.</p>`;
    } else {
        eventsHtml = `
            <div class="modal-events-list">
                ${allEvents.map(e => `
                    <div class="modal-event-row">
                        <span class="modal-event-time">${e.minute}'</span>
                        <span class="modal-event-icon">⚽</span>
                        <span class="modal-event-detail"><strong>${e.name}</strong> (${e.team})</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    body.innerHTML = `
        <div class="modal-match-header">
            <div class="team-header-block">
                ${homeFlag ? `<img src="${homeFlag}" alt="" class="modal-team-flag">` : `<div class="bracket-flag-placeholder" style="width: 60px; height: 40px; font-size: 1.5rem;">?</div>`}
                <div class="modal-team-name">${homeName}</div>
            </div>
            <div class="score-header-block">
                <div class="modal-score-display">${homeScore} - ${awayScore}</div>
                <span class="modal-status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="team-header-block">
                ${awayFlag ? `<img src="${awayFlag}" alt="" class="modal-team-flag">` : `<div class="bracket-flag-placeholder" style="width: 60px; height: 40px; font-size: 1.5rem;">?</div>`}
                <div class="modal-team-name">${awayName}</div>
            </div>
        </div>

        <div class="modal-sub-nav">
            <button class="modal-sub-btn active" data-pane="pane-formazioni">Formazioni & Tattiche</button>
            <button class="modal-sub-btn" data-pane="pane-info">Dettagli & Eventi</button>
        </div>

        <!-- PANE: TACTICS & LINEUPS -->
        <div class="modal-pane active" id="pane-formazioni">
            <div class="pitch-toggle-bar">
                <button class="pitch-toggle-btn active" data-pitch="home">${homeName}</button>
                <button class="pitch-toggle-btn" data-pitch="away">${awayName}</button>
            </div>
            
            <div class="tactical-pitch-container">
                <!-- Home Pitch -->
                <div class="tactical-pitch-wrapper active" id="pitch-wrapper-home">
                    <div class="tactical-pitch-title">
                        <span>${homeName}</span>
                        <span class="team-formation">${homeFormation}</span>
                    </div>
                    <div class="tactical-pitch">
                        <div class="pitch-line-center"></div>
                        <div class="pitch-line-circle"></div>
                        <div class="pitch-line-penalty-home"></div>
                        <div class="pitch-line-penalty-away"></div>
                        <div class="pitch-line-goal-home"></div>
                        <div class="pitch-line-goal-away"></div>
                        ${renderPitchLineup(homeLineup, false)}
                    </div>
                </div>

                <!-- Away Pitch -->
                <div class="tactical-pitch-wrapper" id="pitch-wrapper-away">
                    <div class="tactical-pitch-title">
                        <span>${awayName}</span>
                        <span class="team-formation">${awayFormation}</span>
                    </div>
                    <div class="tactical-pitch">
                        <div class="pitch-line-center"></div>
                        <div class="pitch-line-circle"></div>
                        <div class="pitch-line-penalty-home"></div>
                        <div class="pitch-line-penalty-away"></div>
                        <div class="pitch-line-goal-home"></div>
                        <div class="pitch-line-goal-away"></div>
                        ${renderPitchLineup(awayLineup, true)}
                    </div>
                </div>
            </div>
            <p class="pitch-disclaimer">⚠️ Nota: Le formazioni visualizzate sono supposizioni e stime tattiche prima del calcio d'inizio.</p>
        </div>

        <!-- PANE: INFO & EVENTS -->
        <div class="modal-pane" id="pane-info">
            <div class="stadium-info-card">
                <div class="stadium-info-item">
                    <span class="label">Stadio</span>
                    <span class="value">${stadiumName}</span>
                </div>
                <div class="stadium-info-item">
                    <span class="label">Città</span>
                    <span class="value">${stadiumCity}, ${stadiumCountry}</span>
                </div>
                <div class="stadium-info-item">
                    <span class="label">Capienza</span>
                    <span class="value">${stadiumCapacity} Spettatori</span>
                </div>
                <div class="stadium-info-item">
                    <span class="label">Match ID</span>
                    <span class="value">Gara #${game.id} (${game.type.toUpperCase()})</span>
                </div>
            </div>

            <div class="modal-match-events">
                <div class="modal-events-title">Eventi Incontro</div>
                ${eventsHtml}
            </div>
        </div>
    `;

    // Wire up pane sub-toggles inside modal
    const subBtns = body.querySelectorAll('.modal-sub-btn');
    const panes = body.querySelectorAll('.modal-pane');
    subBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subBtns.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            body.querySelector(`#${btn.getAttribute('data-pane')}`).classList.add('active');
        });
    });

    // Wire up mobile pitch toggles
    const toggleBtns = body.querySelectorAll('.pitch-toggle-btn');
    const homeWrapper = body.querySelector('#pitch-wrapper-home');
    const awayWrapper = body.querySelector('#pitch-wrapper-away');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.getAttribute('data-pitch') === 'home') {
                homeWrapper.classList.add('active');
                awayWrapper.classList.remove('active');
            } else {
                awayWrapper.classList.add('active');
                homeWrapper.classList.remove('active');
            }
        });
    });

    // Show modal overlay
    modal.classList.add('active');
}

// Global click event to catch clicks on match cards
document.addEventListener('click', (e) => {
    const card = e.target.closest('.match-card, .bracket-match-card');
    if (card) {
        // Exclude calendar button click
        if (e.target.closest('.add-to-calendar-btn')) return;
        const gameId = card.getAttribute('data-game-id');
        if (gameId) {
            openMatchDetails(gameId);
        }
    }
});

// Setup closing handlers
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('match-details-modal');
    const closeBtn = document.getElementById('close-match-details-modal');
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.removeAttribute('data-game-id');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modal.removeAttribute('data-game-id');
            }
        });
    }
});

function updateModalLiveUpdates() {
    const modal = document.getElementById('match-details-modal');
    if (!modal || !modal.classList.contains('active')) return;

    const gameId = modal.getAttribute('data-game-id');
    if (!gameId) return;

    const game = STATE.games.find(g => g.id == gameId);
    if (!game) return;

    const finishedVal = game.finished === 'TRUE' || game.finished === true || game.time_elapsed === 'finished';
    const isLive = isGameLive(game);

    if (!isLive && !finishedVal) return;

    // 1. Update scores display
    const scoreDisplay = modal.querySelector('.modal-score-display');
    if (scoreDisplay) {
        scoreDisplay.innerText = `${game.home_score} - ${game.away_score}`;
    }

    // 2. Update status badge
    const statusBadge = modal.querySelector('.modal-status-badge');
    if (statusBadge) {
        let statusText = formatGameDate(game.local_date);
        let statusClass = 'upcoming';
        if (isLive && !finishedVal) {
            statusText = `LIVE • ${getGameDisplayTime(game)}`;
            statusClass = 'live';
        } else if (finishedVal) {
            statusText = 'FINITA';
            statusClass = 'finished';
        }
        statusBadge.innerText = statusText;
        statusBadge.className = `modal-status-badge ${statusClass}`;
    }

    // 3. Update events timeline
    const eventsContainer = modal.querySelector('.modal-match-events');
    if (eventsContainer) {
        const homeTeam = STATE.teamsMap[game.home_team_id];
        const awayTeam = STATE.teamsMap[game.away_team_id];
        const homeName = homeTeam ? homeTeam.name_en : (game.home_team_label || 'TBD');
        const awayName = awayTeam ? awayTeam.name_en : (game.away_team_label || 'TBD');

        const homeEvents = parseScorers(game.home_scorers, homeName, false);
        const awayEvents = parseScorers(game.away_scorers, awayName, true);
        const allEvents = [...homeEvents, ...awayEvents].sort((a, b) => a.minute - b.minute);

        let eventsHtml = '';
        if (allEvents.length === 0) {
            eventsHtml = `<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; font-style: italic; margin-top: 15px;">Nessun evento registrato per questo incontro.</p>`;
        } else {
            eventsHtml = `
                <div class="modal-events-list">
                    ${allEvents.map(e => `
                        <div class="modal-event-row">
                            <span class="modal-event-time">${e.minute}'</span>
                            <span class="modal-event-icon">⚽</span>
                            <span class="modal-event-detail"><strong>${e.name}</strong> (${e.team})</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const listContainer = eventsContainer.querySelector('.modal-events-list') || eventsContainer;
        if (listContainer) {
            const list = eventsContainer.querySelector('.modal-events-list');
            if (list) {
                list.outerHTML = eventsHtml;
            } else {
                const titleElement = eventsContainer.querySelector('.modal-events-title');
                const titleHtml = titleElement ? titleElement.outerHTML : '<div class="modal-events-title">Eventi Incontro</div>';
                eventsContainer.innerHTML = titleHtml + eventsHtml;
            }
        }
    }
}

window.updateModalLiveUpdates = updateModalLiveUpdates;


