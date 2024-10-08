export type Project = {
    project: {
        name: string
    }
    ['validated?']: boolean
    status: 'finished' | 'in_progress' | 'waiting_for_correction' | 'failed'
    cursus_ids: number[]
    final_mark: number
}

export type Skill = { id: 4; level: 2.9; name: 'Unix' }

export default class Student {
    constructor(
        private login: string,
        private image: string,
        private level: number,
        private projects: Project[],
        private correctionPoints: number,
        private wallet: number,
        private skills: Skill[],
        private blackholed: boolean
    ) {}

    getLogin(): string {
        return this.login
    }

    getImage(): string {
        return this.image
    }

    getLevel(): number {
        return this.level
    }

    getProjects(): Project[] {
        return this.projects
    }

    getCorrectionPoints(): number {
        return this.correctionPoints
    }

    getWallet(): number {
        return this.wallet
    }

    getSkills(): Skill[] {
        return this.skills
    }

    isBlackholed(): boolean {
        return this.blackholed
    }
}
