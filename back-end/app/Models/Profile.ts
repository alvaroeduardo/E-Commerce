import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

import User from './User'

export default class Profile extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public secureId: string

    @column()
    public userId: number

    @column()
    public name: string

    @column()
    public genre: string

    @column()
    public enderecoPrincipal: string
    
    @column()
    public enderecoSecundario: string

    @column()
    public celular: string

    @column()
    public cpf: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @beforeCreate()
    public static async addUUID(profile: Profile){
        profile.secureId = uuid()
    }
}
