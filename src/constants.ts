import { PortfolioData } from "./types";

export const initialData: PortfolioData = {
  config: {
    name: "오주은",
    slogan: "사람과 조직의 성장을 잇는 HR 전략가",
    identity: "데이터 기반의 의사결정과 인간 중심의 가치를 조화롭게 설계하는 HR 전문가입니다.",
    about: "10년 이상의 HR 실무 경험을 바탕으로, 조직의 비전과 구성원의 성장을 연결하는 최적의 시스템을 설계합니다. 단순한 관리(Administration)를 넘어 전략적 파트너십(Strategic Partnership)으로서의 HR을 지향합니다.",
    aboutImages: [
      "https://picsum.photos/seed/about1/800/1000",
      "https://picsum.photos/seed/about2/800/1000",
      "https://picsum.photos/seed/about3/800/1000",
      "https://picsum.photos/seed/about4/800/1000"
    ],
    education: [
      "서울대학교 경영대학원 인사조직 석사 (2021)",
      "연세대학교 심리학과 학사 (2015)"
    ],
    experience: [
      "A사 Senior HR Manager (2022 - Present)",
      "B사 HR Operations Lead (2019 - 2022)",
      "C사 Recruitment Specialist (2016 - 2019)"
    ],
    careerHighlights: [
      "글로벌 IT 기업 HR 운영 및 채용 프로세스 최적화 (20% 효율 개선)",
      "성과 중심의 보상 체계 및 평가 시스템 설계 및 도입",
      "조직 문화 내재화를 위한 전사 커뮤니케이션 전략 수립"
    ],
    accentColor: "#FE6941",
    secondaryColor: "#00E5FF",
    fontFamily: "Pretendard",
    role: "HR ARCHITECT",
    linkedin: "https://linkedin.com",
    email: "juon77911@gmail.com",
    resumeUrl: "#",
    skills: ["HR Strategy", "Performance Management", "Talent Acquisition", "Employee Relations", "Data Analysis", "OKRs"],
    fontSizes: {
      slogan: 48,
      body: 16,
      heading: 64,
      projectLineHeight: 1.7,
      projectTitleTop: 72,
      projectTitleBottom: 72
    },
    projectLabels: {
      problem: "Problem Statement",
      approach: "Approach",
      insights: "Key Insights",
      impact: "Actions & Impact",
      contribution: "Contribution"
    },
    sectionDescriptions: {
      about: "저에 대해 더 자세히 알려드릴게요.",
      projects: "우리가 만들어낸 디지털 경험의 결과물입니다.",
      archive: "그동안의 발자취를 기록했습니다."
    },
    adminPassword: "000000"
  },
  projects: [
    {
      id: "1",
      title: "차세대 성과 관리 시스템 구축",
      date: "2024.01 - 2024.12",
      contentBlocks: [
        { id: "b1-1", type: "text", title: "Problem Statement", sectionId: "problem", content: "기존의 연간 평가 방식이 실시간 피드백을 반영하지 못해 구성원들의 동기부여가 저하되고 성과 지표가 불분명했습니다." },
        { id: "b1-2", type: "image", content: "https://picsum.photos/seed/hr1/1200/800" },
        { id: "b1-3", type: "text", title: "Approach", sectionId: "approach", content: "OKRs(Objectives and Key Results) 방법론을 도입하고, 상시 피드백이 가능한 디지털 플랫폼을 설계했습니다." },
        { id: "b1-4", type: "text", title: "Key Insights", sectionId: "insights", content: "단순한 도구 도입보다 '피드백 문화'의 정착이 성과 개선의 핵심임을 발견했습니다." },
        { id: "b1-5", type: "text", title: "Actions & Impact", sectionId: "impact", content: "전사 도입 후 구성원 만족도 35% 상승, 목표 달성률 15% 개선이라는 성과를 거두었습니다." },
        { id: "b1-6", type: "text", title: "Contribution", sectionId: "contribution", content: "프로젝트 총괄 기획, 평가 지표 설계, 전사 교육 및 변화 관리 주도" }
      ],
      visibleSections: {
        problem: true,
        approach: true,
        insights: true,
        impact: true,
        contribution: true
      },
      images: [
        "https://picsum.photos/seed/hr1/1200/800",
        "https://picsum.photos/seed/hr2/1200/800",
        "https://picsum.photos/seed/hr3/1200/800"
      ]
    },
    {
      id: "2",
      title: "글로벌 인재 채용 브랜딩 강화",
      date: "2023.05 - 2023.11",
      contentBlocks: [
        { id: "b2-1", type: "text", title: "Problem Statement", sectionId: "problem", content: "기술 인재 시장에서의 경쟁력 약화로 인해 핵심 개발 인력 채용 리드타임이 장기화되었습니다." },
        { id: "b2-2", type: "text", title: "Approach", sectionId: "approach", content: "현직자 인터뷰 기반의 EVP(Employee Value Proposition)를 재정의하고, 기술 블로그 및 링크드인 캠페인을 강화했습니다." },
        { id: "b2-3", type: "image", content: "https://picsum.photos/seed/recruit1/1200/800" },
        { id: "b2-4", type: "text", title: "Key Insights", sectionId: "insights", content: "후보자들은 단순한 복지보다 '기술적 성장 가능성'에 더 큰 매력을 느낀다는 점을 파악했습니다." },
        { id: "b2-5", type: "text", title: "Actions & Impact", sectionId: "impact", content: "채용 리드타임 40% 단축, 기술 인재 지원율 전년 대비 2배 증가." },
        { id: "b2-6", type: "text", title: "Contribution", sectionId: "contribution", content: "EVP 수립, 채용 채널 믹스 최적화, 콘텐츠 가이드라인 제작" }
      ],
      visibleSections: {
        problem: true,
        approach: true,
        insights: true,
        impact: true,
        contribution: true
      },
      images: [
        "https://picsum.photos/seed/recruit1/1200/800",
        "https://picsum.photos/seed/recruit2/1200/800"
      ]
    },
    {
      id: "3",
      title: "조직 문화 진단 및 개선 프로젝트",
      date: "2022.08 - 2023.02",
      contentBlocks: [
        { id: "b3-1", type: "text", title: "Problem Statement", sectionId: "problem", content: "급격한 조직 규모 확대에 따른 부서 간 사일로 현상과 커뮤니케이션 단절 문제가 발생했습니다." },
        { id: "b3-2", type: "text", title: "Approach", sectionId: "approach", content: "전사 조직 문화 진단 설문을 실시하고, 'Cross-functional Coffee Chat' 및 타운홀 미팅 형식을 개편했습니다." },
        { id: "b3-3", type: "text", title: "Key Insights", sectionId: "insights", content: "비공식적 소통 채널의 활성화가 심리적 안전감을 높이는 데 결정적인 역할을 함을 확인했습니다." },
        { id: "b3-4", type: "image", content: "https://picsum.photos/seed/culture1/1200/800" },
        { id: "b3-5", type: "text", title: "Actions & Impact", sectionId: "impact", content: "부서 간 협업 만족도 점수 4.2/5.0 달성 (기존 2.8)." },
        { id: "b3-6", type: "text", title: "Contribution", sectionId: "contribution", content: "진단 도구 설계, 데이터 분석, 개선 액션 플랜 수립 및 실행" }
      ],
      visibleSections: {
        problem: true,
        approach: true,
        insights: true,
        impact: true,
        contribution: true
      },
      images: [
        "https://picsum.photos/seed/culture1/1200/800",
        "https://picsum.photos/seed/culture2/1200/800"
      ]
    }
  ],
  archive: [
    { id: "a1", year: "2025", category: "인력 계획", title: "2025 인력 계획 수립", details: ["2025 인력 계획 수립", "경력 채용 (Tech/Staff)", "ATS/OCC/온보딩 시스템 개선 및 유지보수"] },
    { id: "a2", year: "2024", category: "채용 기획", title: "채용 기획 및 운영", details: ["팀네이버 채용 및 인력 증감 현황 관리", "공정채용 우수 기업 어워즈 응모 자료 기획", "링크드인 콘텐츠 및 플랫폼 관리", "효율적인 T/O 승인", "한국 경영자총협회 회장상 수상", "링크드인 공식채널 팔로워 16,540명 추가 확보"] },
    { id: "a3", year: "2023", category: "문화 진단", title: "기업문화 적합도 검사", details: ["기업문화적합도 검사 유효성 분석", "팀네이버 신입공채 전형 설계 및 운영 (디자인/마케팅)", "쇼핑 부문 조직장 대상 AHP 조사 후 핵심 Workstyle 키워드 도출", "기업문화적합도 검사 기반 BEI 인터뷰 문항 설계 (쇼핑 부문 파일럿 도입)", "디자인/마케팅 직군 신입사원 13명 선발 완료"] },
    { id: "a4", year: "2022", category: "신입/경력 채용", title: "채용 릴레이션", details: ["경력 채용 (Design/S&B/Staff)", "디자인 신입사원 선발 프로그램 (FFWD22) 전형 설계 및 운영", "디자인 산학연계 선발 프로그램 설계", "2580 챗봇 채용 파트 FAQ 설계", "경력사원 47명 선발 완료", "디자인 직군 신입사원 8명 선발 완료", "네이버 디자인 - KAIST 산업디자인학과, 서울대 디자인학부 간 MOU 체결", "채용 관련 문의 리소스 감소 (3개월 채용 관련 FAQ 조회 합계 : 2,293회)"] },
    { id: "a5", year: "2021", category: "신입/경력 채용", title: "채용 릴레이션", details: ["디자인 신입사원 선발 프로그램 (FFWD21) 전형 설계 및 운영", "경력 채용 (Design/S&B/Staff)", "디자인 직군 신입사원 0명 선발 완료", "유효 지원자 확대 위한 포지션별 영입 경로"] },
    { id: "a6", year: "2020", category: "채용 홍보", title: "채용 홍보 브로셔", details: ["코로나 19 관련 긴급 비대면 입사 전환", "네이버 채용 홍보 브로셔 기획/제작", "연세대 전기전자공학부 - Clova CIC 산학 협력 프로그램 운영", "국문/영문 채용 홍보 브로셔 발행 (30p 내외, 각종 공식 릴레이션 행사 활용)", "연세대 전기전자공학부 재학생 300여 명 대상 채용 설명회 기획 (채용 연계 2명)"] },
    { id: "a7", year: "2019", category: "온보딩", title: "입사 ('19.09)", details: ["신규입사자 온보딩 - OT 자료 리뉴얼", "릴레이션 프로그램 (HACKDAY/KAIST잡페어/ICCV) 지원"] }
  ]
};
