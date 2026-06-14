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
    
    // Squadre Tab
    searchSquadreInput: document.getElementById('search-squadre-input'),
    teamsCardsGrid: document.getElementById('teams-cards-grid'),
    
    // Simulatore Tab
    simConfigPanel: document.getElementById('sim-config-panel'),
    simActivePanel: document.getElementById('sim-active-panel'),
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
    
    // Footer
    apiStatus: document.getElementById('api-status')
};

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', () => {
    setupTabRouter();
    setupFilters();
    setupSimulatorControls();
    loadData();
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

// 4. RENDER LIVE MATCHES TICKER
function renderLiveMatchesTicker() {
    const liveGames = STATE.games.filter(game => {
        const isLive = game.time_elapsed && game.time_elapsed !== 'notstarted' && game.time_elapsed !== 'finished';
        return isLive && (game.finished !== 'TRUE' && game.finished !== true);
    });

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
            <span class="live-time">${game.time_elapsed === 'live' ? 'LIVE' : game.time_elapsed + '\''}</span>
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

// 5. RENDER MATCHES TAB
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
        const isLive = game.time_elapsed && game.time_elapsed !== 'notstarted' && game.time_elapsed !== 'finished';
        
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
        const isLive = game.time_elapsed && game.time_elapsed !== 'notstarted' && game.time_elapsed !== 'finished';
        
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
            statusText = `LIVE &bull; ${game.time_elapsed === 'live' ? '1\'' : game.time_elapsed + '\''}`;
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
}

// 10. INTERACTIVE MATCH SIMULATOR ENGINE
function setupSimulatorControls() {
    DOM.startSimulationBtn.addEventListener('click', startMatchSimulation);
    DOM.simPauseBtn.addEventListener('click', togglePauseSimulation);
    DOM.simStopBtn.addEventListener('click', stopMatchSimulation);
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

    // Reset Simulation State
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
        events: []
    };

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
        sim.homeScorers.push(scorer);
        DOM.simHomeScorersList.appendChild(scorerItem);
    } else {
        sim.awayScorers.push(scorer);
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
