import BaseSchema from '@ioc:Adonis/Lucid/Schema'


export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('secure_id').index()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text('name')
      table.string('genre')
      table.text('endereco_principal').notNullable()
      table.text('endereco_secundario').notNullable()
      table.string('celular').notNullable()
      table.string('cpf').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
