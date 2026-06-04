import streamlit as st
import datetime

# --- Page Configuration ---
st.set_page_config(
    page_title="재팬 로컬로그 | Japan Localog",
    page_icon="🌸",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Custom Styling (AI Studio Design System Port) ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');

    :root {
        --brand-accent: #ff6b6b;
        --brand-blue: #e0f2fe;
        --brand-text: #1e293b;
        --brand-mint: #ccfbf1;
        --brand-yellow: #fef08a;
        --slate-50: #f8fafc;
        --slate-100: #f1f5f9;
        --slate-200: #e2e8f0;
        --slate-400: #94a3b8;
        --slate-500: #64748b;
        --purple-accent: #a855f7;
    }

    /* Page Setup */
    .stApp {
        background-color: var(--slate-50);
        font-family: 'Inter', sans-serif;
    }

    /* Hide Streamlit elements */
    header, footer {visibility: hidden;}
    [data-testid="stHeader"] {background: rgba(0,0,0,0);}

    /* Main Container Padding */
    .main .block-container {
        padding: 3rem 6rem;
    }

    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: white !important;
        border-right: 1px solid var(--slate-100);
        width: 256px !important;
    }

    /* Typography */
    .font-display {
        font-family: 'Inter', sans-serif;
        font-weight: 900;
        letter-spacing: -0.05em;
    }

    /* Card Components */
    .glass-card {
        background: white;
        border-radius: 32px;
        padding: 2rem;
        border: 1px solid var(--slate-100);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
        margin-bottom: 2rem;
    }

    /* Profile Image (Sidebar) */
    .profile-container {
        width: 160px;
        height: 160px;
        border-radius: 24px;
        background-color: var(--brand-blue);
        margin: 0 auto 1.5rem auto;
        overflow: hidden;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .profile-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Weather Page Specific: Purple Border Card */
    .weather-card {
        background-color: white;
        border-radius: 2rem;
        padding: 2rem;
        border: 1px solid var(--slate-100);
        border-left: 6px solid var(--purple-accent);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        margin-bottom: 1.5rem;
        transition: transform 0.2s ease;
    }
    .weather-card:hover {
        transform: translateX(5px);
    }

    /* Badge Styles */
    .badge-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
    }

    /* Radio Button Hijack (Sidebar Navigation) */
    div[role="radiogroup"] > label {
        background-color: transparent !important;
        border: none !important;
        padding: 0.75rem 1rem !important;
        border-radius: 12px !important;
        font-size: 14px !important;
        color: var(--slate-500) !important;
        transition: all 0.2s !important;
    }
    div[role="radiogroup"] > label[data-baseweb="radio"] {
        margin-bottom: 4px;
    }
    div[role="radiogroup"] > label:hover {
        background-color: var(--slate-100) !important;
        color: var(--brand-text) !important;
    }
    div[role="radiogroup"] label div[data-testid="stMarkdownContainer"] p {
        font-weight: 500;
    }

    /* Mini Widget Hub */
    .widget-hub {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    .mini-widget {
        background: white;
        padding: 0.5rem 1rem;
        border-radius: 12px;
        border: 1px solid var(--slate-100);
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    /* Home Quadrants */
    .home-quadrant {
        height: 280px;
        border-radius: 32px;
        padding: 2rem;
        overflow: hidden;
        position: relative;
    }
</style>
""", unsafe_allow_html=True)

# --- Sidebar Logic ---
with st.sidebar:
    # 1. Profile Area
    st.markdown(f"""
    <div style="padding: 1.5rem 0; text-align: center;">
        <div class="profile-container">
            <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=400&h=400&fit=crop" class="profile-img">
        </div>
        <h2 class="font-display" style="font-size: 1.5rem; color: var(--brand-text); margin-bottom: 0.25rem;">ジョン</h2>
        <p style="font-size: 11px; color: var(--slate-400); line-height: 1.4; margin-bottom: 1.5rem;">
            일본 방방곳곳을 직접 다녀오고,<br>그 중 추천 장소를 소개합니다!
        </p>
        <div style="background: var(--slate-50); padding: 1rem; border-radius: 16px; border: 1px solid var(--slate-100); position: relative;">
            <p style="font-size: 11px; font-weight: 500; color: var(--brand-text); margin: 0; line-height: 1.5;">
                "지금 일본은 한창 더워지고 있네요! 이번 주 추천지는 홋카이도입니다✨"
            </p>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("<div style='margin: 1.5rem 0;'></div>", unsafe_allow_html=True)

    # 2. Navigation
    menu_icons = {
        "Home": "🏠 홈",
        "Posts": "🗺️ 여행 기록",
        "Weather": "☀️ 현지 날씨",
        "Exchange": "💴 환율 정보",
        "News": "📰 현지 뉴스",
        "Translator": "📱 번역기",
        "Recommendations": "🍣 추천 맛집",
        "Community": "🤝 여행 정보 공유"
    }
    
    # We use a radio as the menu
    menu_selection = st.radio(
        "Navigation", 
        options=list(menu_icons.keys()),
        format_func=lambda x: menu_icons[x],
        label_visibility="collapsed"
    )

# --- Header Component ---
def render_header(title, emoji, subtitle):
    st.markdown(f"""
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; border-bottom: 1px solid var(--slate-100); padding-bottom: 2rem;">
        <div>
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                <div style="background: var(--brand-blue); padding: 0.75rem; border-radius: 16px; font-size: 1.5rem; line-height: 1;">{emoji}</div>
                <h1 class="font-display" style="font-size: 3rem; margin: 0;">{title}</h1>
            </div>
            <p style="color: var(--slate-400); font-weight: 500; font-size: 1.1rem; margin-left: 0.5rem;">{subtitle}</p>
        </div>
        <div class="widget-hub">
            <div class="mini-widget"><span style="color: var(--brand-accent);">￥</span> 912.45</div>
            <div class="mini-widget">Tokyo ☀️ 24°</div>
            <div class="mini-widget"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; margin-right: 4px;"></span> 경보: 정상 🟢</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# --- Views ---

if menu_selection == "Home":
    render_header("재팬 로컬로그", "✈️", "직접 다녀오고 알려주는 일본의 찐맛집·놀거리 지도!")
    
    col_left, col_right = st.columns(2)
    
    with col_left:
        # Quadrant 1: Image Visual Log
        st.markdown("""
        <div class="home-quadrant" style="padding:0; margin-bottom: 2rem;">
            <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070" style="width:100%; height:100%; object-fit:cover;">
            <div style="position:absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); pointer-events:none;"></div>
            <div style="position:absolute; bottom: 2rem; left: 2.5rem; color: white;">
                <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.8; margin-bottom: 0.25rem;">Visual Log</p>
                <h3 style="font-size: 1.75rem; font-weight: 700;">아름다운 일본의 풍경</h3>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Quadrant 3: Season Tips
        st.markdown("""
        <div class="home-quadrant" style="background-color: var(--brand-blue); border: 1px solid #dbeafe; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <div style="background: white; width: fit-content; padding: 0.5rem; border-radius: 12px; margin-bottom: 1.5rem; font-size: 1.25rem;">🗓️</div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h4 style="font-weight: 700; font-size: 1.25rem; color: #1e3a8a;">시즌 추천 팁</h4>
                    <span style="font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; cursor: pointer;">더보기 ></span>
                </div>
                <div style="background: rgba(255,255,255,0.7); padding: 1.25rem; border-radius: 20px; border: 1px solid white;">
                    <p style="font-size: 10px; font-weight: 700; color: var(--brand-accent); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.5rem;">5~6월 추천</p>
                    <p style="font-size: 14px; font-weight: 500; color: #1e293b; line-height: 1.6;">
                        이바라키 국영 히타치 해변공원의 <b style="color: var(--brand-accent);">네모필라 축제</b> 정보 확인해보세요! 끝없는 푸른 꽃밭이 정말 아름다워요. ✨
                    </p>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem; opacity: 0.3;">
                <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Monthly Guide</span>
                <div style="flex: 1; height: 1px; background-color: #3b82f6;"></div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    with col_right:
        # Quadrant 2: Flight Brand
        st.markdown("""
        <div class="home-quadrant" style="background-color: #1a2b3c; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; margin-bottom: 2rem; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);">
            <div style="position:absolute; inset:0; opacity: 0.1; background-image: radial-gradient(#40a9ff 1px, transparent 1px); background-size: 20px 20px;"></div>
            <div style="position:relative; text-align: center;">
                <div style="font-size: 3.5rem; transform: rotate(45deg); margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.5));">✈️</div>
                <h2 class="font-display" style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #e0f2fe;">In-Flight Now</h2>
                <p style="font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: #7dd3fc; font-weight: 700;">Japan Localog Guide</p>
            </div>
            <div style="position:absolute; bottom: 2rem; left: 2.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 8px; height: 8px; background-color: #38bdf8; border-radius: 50%; animation: pulse 2s infinite;"></div>
                <span style="font-size: 10px; color: #38bdf8; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-family: monospace;">Cruising at Local Spot</span>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Quadrant 4: Rankings
        st.markdown("""
        <div class="home-quadrant" style="background-color: white; border: 1px solid var(--slate-100); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h4 style="font-weight: 700; font-size: 1.25rem;">실시간 인기 여행지</h4>
                <span class="badge-label" style="background-color: var(--brand-yellow);">Top 3</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 1.25rem; padding: 0.75rem; border-radius: 20px; transition: 0.2s;">
                    <span style="font-size: 1.5rem; font-weight: 700; font-style: italic; color: var(--brand-accent);">01</span>
                    <div style="flex: 1;">
                        <p style="font-weight: 700; margin: 0; font-size: 0.95rem;">도쿄 아자부주다이</p>
                        <p style="font-size: 9px; color: var(--slate-400); text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em;">맛집/카페</p>
                    </div>
                    <div style="width: 40px; height: 40px; border-radius: 12px; background: #f1f5f9; overflow: hidden;">
                        <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 1.25rem; padding: 0.75rem;">
                    <span style="font-size: 1.5rem; font-weight: 700; font-style: italic; color: var(--brand-accent);">02</span>
                    <div style="flex: 1;">
                        <p style="font-weight: 700; margin: 0; font-size: 0.95rem;">오사카 나라 사슴공원</p>
                        <p style="font-size: 9px; color: var(--slate-400); text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em;">관광지</p>
                    </div>
                    <div style="width: 40px; height: 40px; border-radius: 12px; background: #f1f5f9; overflow: hidden;">
                        <img src="https://images.unsplash.com/photo-1542640244-7e672d6cef21?w=100" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

elif menu_selection == "Weather":
    render_header("지역별 날씨 정보", "☀️", "방문하실 지역의 실시간 날씨와 팁을 확인하세요.")
    
    # 1. Search Bar Simulation
    st.markdown("""
    <div style="max-width: 600px; margin: 0 auto 3rem auto; position: relative;">
        <input type="text" placeholder="지역 이름을 검색하세요 (예: 도쿄, 오사카...)" style="width: 100%; padding: 1.25rem 3.5rem; border-radius: 2rem; border: 1px solid var(--slate-100); background-color: white; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); font-size: 1rem; outline: none;">
        <span style="position: absolute; left: 1.5rem; top: 50%; transform: translateY(-50%); font-size: 1.25rem; color: #cbd5e1;">🔍</span>
    </div>
    """, unsafe_allow_html=True)

    col_map, col_info = st.columns([1.2, 1])
    
    with col_map:
        st.markdown("""
        <div class="glass-card" style="height: 550px; display: flex; flex-direction: column; align-items: center; padding: 1.5rem;">
            <p style="font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; margin-bottom: 2rem;">지도를 선택하여 정보를 확인하세요</p>
            <img src="https://ais-pre-baftxehulfefq2euqziama-74341912323.asia-northeast1.run.app/src/assets/images/regenerated_image_1780563632140.png" style="max-width: 90%; max-height: 80%; object-fit: contain;">
        </div>
        """, unsafe_allow_html=True)

    with col_info:
        # Weather Display Header
        st.markdown("""
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 class="font-display" style="font-size: 2.5rem; color: var(--brand-text); margin: 0;">도쿄 (Tokyo)</h2>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 3rem; font-weight: 900; color: var(--brand-accent);">24<small style="font-size: 1.25rem;">°C</small></span>
                <div style="background: var(--brand-mint); padding: 0.75rem; border-radius: 50%; font-size: 1.5rem;">☀️</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Metrics Box
        st.markdown("""
        <div class="glass-card" style="padding: 1.5rem; margin-bottom: 2.5rem; background-color: var(--slate-50);">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; gap: 1rem;">
                <div>
                    <p style="font-size: 10px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; margin-bottom: 0.5rem;">습도</p>
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--brand-text);">62%</p>
                </div>
                <div style="border-left: 1px solid var(--slate-200); border-right: 1px solid var(--slate-200);">
                    <p style="font-size: 10px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; margin-bottom: 0.5rem;">미세먼지</p>
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--brand-text);">좋음</p>
                </div>
                <div>
                    <p style="font-size: 10px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; margin-bottom: 0.5rem;">체감온도</p>
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--brand-text);">26°C</p>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Weather Tip Cards (The specific request for Purple Border Cards)
        st.markdown("<p style='font-size: 12px; font-weight: 700; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;'>💡 지역별 날씨 필수 팁</p>", unsafe_allow_html=True)
        
        tips = [
            {"title": "자외선 주의", "desc": "한낮의 햇살이 매우 강합니다. 선크림과 모자를 꼭 챙기세요!"},
            {"title": "일교차 안내", "desc": "밤에는 기온이 뚝 떨어질 수 있으니 얇은 가디건을 준비하세요."},
            {"title": "우산 준비", "desc": "오후 늦게 갑작스러운 소나기 예보가 있습니다. 휴대용 우산을 추천합니다."}
        ]

        for tip in tips:
            st.markdown(f"""
            <div class="weather-card">
                <p style="font-size: 10px; font-weight: 900; color: var(--purple-accent); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">{tip['title']}</p>
                <p style="font-size: 0.95rem; font-weight: 500; color: var(--brand-text); margin: 0; line-height: 1.5;">{tip['desc']}</p>
            </div>
            """, unsafe_allow_html=True)

elif menu_selection == "Exchange":
    render_header("환율 계산 & 정보", "💴", "엔화 환율 추이를 확인하고 간편하게 계산해 보세요.")
    
    col_calc, col_info = st.columns([1, 1])
    
    with col_calc:
        st.markdown("""
        <div class="glass-card" style="height: 480px;">
            <h3 style="font-weight: 700; font-size: 1.25rem; margin-bottom: 2rem;">실시간 계산기</h3>
            
            <div style="margin-bottom: 2.5rem;">
                <label style="font-size: 11px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.1em; margin-left: 0.5rem;">한국 원 (KRW)</label>
                <div style="position: relative; margin-top: 0.5rem;">
                    <input type="number" value="10000" style="width: 100%; padding: 1.25rem; border-radius: 1rem; border: none; background: var(--slate-50); font-size: 1.5rem; font-weight: 700; text-align: right; padding-right: 3rem;">
                    <span style="position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); font-weight: 700; color: var(--slate-400);">₩</span>
                </div>
            </div>

            <div style="display: flex; justify-content: center; margin: -1.5rem 0; position: relative; z-index: 2;">
                <div style="background: white; border: 1px solid var(--slate-100); padding: 0.5rem; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); color: var(--brand-accent);">🔄</div>
            </div>

            <div style="margin-top: 2.5rem;">
                <label style="font-size: 11px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.1em; margin-left: 0.5rem;">일본 엔 (JPY)</label>
                <div style="position: relative; margin-top: 0.5rem;">
                    <input type="number" value="912" style="width: 100%; padding: 1.25rem; border-radius: 1rem; border: none; background: var(--slate-50); font-size: 1.5rem; font-weight: 700; text-align: right; padding-right: 3rem;">
                    <span style="position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); font-weight: 700; color: var(--slate-400);">¥</span>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    with col_info:
        st.markdown("""
        <div class="glass-card" style="height: 480px; background-color: var(--slate-50); padding: 2.5rem;">
            <p style="font-size: 1.25rem; font-weight: 900; color: var(--brand-text); margin-bottom: 2rem;">📈 최근 1개월 환율 추이</p>
            <div style="height: 250px; background: white; border-radius: 1.5rem; border: 1px solid var(--slate-100); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <!-- Graph Simulation with CSS -->
                <div style="position: absolute; width: 100%; height: 100%; display: flex; align-items: flex-end; padding: 0 1rem; gap: 10px;">
                    <div style="flex: 1; height: 60%; background: var(--brand-accent); opacity: 0.1; border-radius: 4px 4px 0 0;"></div>
                    <div style="flex: 1; height: 75%; background: var(--brand-accent); opacity: 0.2; border-radius: 4px 4px 0 0;"></div>
                    <div style="flex: 1; height: 50%; background: var(--brand-accent); opacity: 0.1; border-radius: 4px 4px 0 0;"></div>
                    <div style="flex: 1; height: 85%; background: var(--brand-accent); opacity: 0.3; border-radius: 4px 4px 0 0; border-top: 3px solid var(--brand-accent);"></div>
                    <div style="flex: 1; height: 40%; background: var(--brand-accent); opacity: 0.1; border-radius: 4px 4px 0 0;"></div>
                    <div style="flex: 1; height: 65%; background: var(--brand-accent); opacity: 0.2; border-radius: 4px 4px 0 0;"></div>
                </div>
                <span style="font-size: 11px; font-weight: 700; color: var(--slate-400); z-index: 1;">환율 데이터 로드 중...</span>
            </div>
            <p style="font-size: 11px; color: var(--slate-400); text-align: center; margin-top: 1.5rem;">데이터 제공: 정(Jeong) 투어 실시간 API (JPY/KRW)</p>
        </div>
        """, unsafe_allow_html=True)

else:
    # Generic Placeholder for unfinished tabs (Posts, News, etc.)
    render_header(menu_selection, "🍜", f"현재 {menu_selection} 페이지의 리액트 소스 코드를 스트림잇으로 이식 작업 중입니다.")
    st.markdown(f"""
    <div style="text-align: center; padding: 10rem 0;">
        <p style="font-size: 1.5rem; color: var(--slate-400); font-weight: 500; font-style: italic;">
            "'{menu_selection}' 페이지 준비 중입니다. 잠시만 기다려 주세요! 🌸"
        </p>
        <div style="margin-top: 2rem; display: flex; justify-content: center; gap: 1rem;">
             <div style="background: white; padding: 1rem 2rem; border-radius: 12px; border: 1px solid var(--slate-100); font-weight: 700; color: var(--brand-accent); box-shadow: 0 2px 4px rgba(0,0,0,0.05);">JSON Data Parsing...</div>
             <div style="background: white; padding: 1rem 2rem; border-radius: 12px; border: 1px solid var(--slate-100); font-weight: 700; color: var(--brand-text); box-shadow: 0 2px 4px rgba(0,0,0,0.05);">CSS Injected</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# --- Floating Admin Button ---
st.markdown("""
<div style="position: fixed; bottom: 2rem; right: 2rem; z-index: 999; opacity: 0.4;">
    <div style="background: white; border: 1px solid var(--slate-200); padding: 0.5rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); cursor: pointer;">
        🔌
    </div>
</div>
""", unsafe_allow_html=True)
