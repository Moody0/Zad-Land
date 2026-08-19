"use client";

import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

interface FooterCategoryOption {
    id: string;
    name: string;
}

interface FooterContentSectionProps {
    footerContent: Record<string, string>;
    categories: FooterCategoryOption[];
    onFieldChange: (field: string, value: string) => void;
    t: (key: string) => string;
}

function SectionTitle({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="mb-6">
            <div>
                <h3 className="text-lg font-bold text-text-main dark:text-white">{title}</h3>
                {description ? (
                    <p className="mt-1 text-sm text-text-sub dark:text-gray-400">{description}</p>
                ) : null}
            </div>
        </div>
    );
}

function TextField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-text-main dark:text-white">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white px-4 py-3 text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/[0.04] dark:bg-gray-900 dark:text-white"
            />
        </div>
    );
}

function TextAreaField({
    label,
    value,
    onChange,
    rows = 4,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-text-main dark:text-white">{label}</label>
            <textarea
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full resize-none rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white px-4 py-3 text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/[0.04] dark:bg-gray-900 dark:text-white"
            />
        </div>
    );
}

function SelectField({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: FooterCategoryOption[];
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-text-main dark:text-white">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-white px-4 py-3 text-text-main outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/[0.04] dark:bg-gray-900 dark:text-white"
            >
                <option value="">{label}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

function LinkEditor({
    title,
    labelValue,
    labelArValue,
    urlValue,
    onFieldChange,
    labelKey,
    labelArKey,
    urlKey,
    t,
}: {
    title: string;
    labelValue: string;
    labelArValue: string;
    urlValue: string;
    onFieldChange: (field: string, value: string) => void;
    labelKey: string;
    labelArKey: string;
    urlKey: string;
    t: (key: string) => string;
}) {
    return (
        <div className="rounded-2xl border border-black/[0.04] dark:border-white/[0.04] bg-white/70 p-5 dark:border-white/[0.04] dark:bg-gray-900/60">
            <p className="mb-4 text-sm font-bold text-text-main dark:text-white">{title}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <TextField
                    label={`${t('admin.englishLabel') || 'English Label'}`}
                    value={labelValue}
                    onChange={(value) => onFieldChange(labelKey, value)}
                />
                <TextField
                    label={`${t('admin.arabicLabel') || 'Arabic Label'}`}
                    value={labelArValue}
                    onChange={(value) => onFieldChange(labelArKey, value)}
                />
                <TextField
                    label={t('admin.linkUrl') || 'Link URL'}
                    value={urlValue}
                    onChange={(value) => onFieldChange(urlKey, value)}
                    placeholder="/about-us or https://example.com"
                />
            </div>
        </div>
    );
}

export default function FooterContentSection({
    footerContent,
    categories,
    onFieldChange,
    t,
}: FooterContentSectionProps) {
    return (
        <div className="rounded-2xl border border-black/[0.04] dark:border-white/[0.04] bg-surface-light p-8 dark:border-white/[0.04] dark:bg-surface-dark">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white">
                    {t('admin.footerContent') || 'Footer Content'}
                </h2>
                <p className="text-text-sub dark:text-gray-400">
                    {t('admin.footerContentDescription') || 'Control the text, links, social accounts, and shop links shown in the site footer.'}
                </p>
            </div>

            <div className="space-y-10">
                <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-800/40">
                    <SectionTitle
                        title={t('admin.footerBranding') || 'Branding'}
                        description={t('admin.footerBrandingDescription') || 'Edit the brand title, description, and copyright shown on the left side of the footer.'}
                    />

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-5">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">EN</span>
                                <span className="font-bold text-text-main dark:text-white">{t('admin.englishContent')}</span>
                            </div>
                            <TextField
                                label={t('admin.brandName') || 'Brand Name'}
                                value={footerContent.footerBrandTitle}
                                onChange={(value) => onFieldChange('footerBrandTitle', value)}
                            />
                            <TextAreaField
                                label={t('admin.description')}
                                value={footerContent.footerBrandDescription}
                                onChange={(value) => onFieldChange('footerBrandDescription', value)}
                                rows={4}
                            />
                            <TextField
                                label={t('admin.copyrightText') || 'Copyright Text'}
                                value={footerContent.footerCopyright}
                                onChange={(value) => onFieldChange('footerCopyright', value)}
                            />
                        </div>

                        <div className="space-y-5" dir="rtl">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">AR</span>
                                <span className="font-bold text-text-main dark:text-white">{t('admin.arabicContent')}</span>
                            </div>
                            <TextField
                                label={t('admin.brandName') || 'Brand Name'}
                                value={footerContent.footerBrandTitleAr}
                                onChange={(value) => onFieldChange('footerBrandTitleAr', value)}
                            />
                            <TextAreaField
                                label={t('admin.description')}
                                value={footerContent.footerBrandDescriptionAr}
                                onChange={(value) => onFieldChange('footerBrandDescriptionAr', value)}
                                rows={4}
                            />
                            <TextField
                                label={t('admin.copyrightText') || 'Copyright Text'}
                                value={footerContent.footerCopyrightAr}
                                onChange={(value) => onFieldChange('footerCopyrightAr', value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-800/40">
                    <SectionTitle
                        title={t('admin.socialLinks') || 'Social Links'}
                        description={t('admin.socialLinksDescription') || 'Add or replace the social URLs used by the footer icons.'}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-black/[0.04] dark:border-white/[0.04] p-5 dark:border-white/[0.04]">
                            <div className="mb-3 flex items-center gap-2 text-text-main dark:text-white">
                                <FaInstagram className="text-xl text-primary" />
                                <span className="font-bold">Instagram</span>
                            </div>
                            <TextField
                                label={t('admin.linkUrl') || 'Link URL'}
                                value={footerContent.footerInstagramUrl}
                                onChange={(value) => onFieldChange('footerInstagramUrl', value)}
                                placeholder="https://instagram.com/your-brand"
                            />
                        </div>
                        <div className="rounded-2xl border border-black/[0.04] dark:border-white/[0.04] p-5 dark:border-white/[0.04]">
                            <div className="mb-3 flex items-center gap-2 text-text-main dark:text-white">
                                <FaFacebook className="text-xl text-primary" />
                                <span className="font-bold">Facebook</span>
                            </div>
                            <TextField
                                label={t('admin.linkUrl') || 'Link URL'}
                                value={footerContent.footerFacebookUrl}
                                onChange={(value) => onFieldChange('footerFacebookUrl', value)}
                                placeholder="https://facebook.com/your-brand"
                            />
                        </div>
                        <div className="rounded-2xl border border-black/[0.04] dark:border-white/[0.04] p-5 dark:border-white/[0.04]">
                            <div className="mb-3 flex items-center gap-2 text-text-main dark:text-white">
                                <FaWhatsapp className="text-xl text-primary" />
                                <span className="font-bold">WhatsApp</span>
                            </div>
                            <TextField
                                label={t('admin.linkUrl') || 'Link URL'}
                                value={footerContent.footerWhatsappUrl}
                                onChange={(value) => onFieldChange('footerWhatsappUrl', value)}
                                placeholder="https://wa.me/123456789"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-800/40">
                    <SectionTitle
                        title={t('admin.footerShopSection') || 'Shop Section'}
                        description={t('admin.footerShopSectionDescription') || 'Rename the shop column and choose the categories that should appear there.'}
                    />

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <TextField
                            label={`${t('admin.englishLabel') || 'English Label'} (${t('admin.title')})`}
                            value={footerContent.footerShopTitle}
                            onChange={(value) => onFieldChange('footerShopTitle', value)}
                        />
                        <div dir="rtl">
                            <TextField
                                label={`${t('admin.arabicLabel') || 'Arabic Label'} (${t('admin.title')})`}
                                value={footerContent.footerShopTitleAr}
                                onChange={(value) => onFieldChange('footerShopTitleAr', value)}
                            />
                        </div>
                    </div>

                    <p className="mt-5 text-sm text-text-sub dark:text-gray-400">
                        {t('admin.footerCategoriesHint') || 'Choose up to four categories. Empty slots will fall back to the featured categories list.'}
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <SelectField
                            label={`${t('admin.footerCategorySlot') || 'Footer Category'} 1`}
                            value={footerContent.footerCategory1Id}
                            options={categories}
                            onChange={(value) => onFieldChange('footerCategory1Id', value)}
                        />
                        <SelectField
                            label={`${t('admin.footerCategorySlot') || 'Footer Category'} 2`}
                            value={footerContent.footerCategory2Id}
                            options={categories}
                            onChange={(value) => onFieldChange('footerCategory2Id', value)}
                        />
                        <SelectField
                            label={`${t('admin.footerCategorySlot') || 'Footer Category'} 3`}
                            value={footerContent.footerCategory3Id}
                            options={categories}
                            onChange={(value) => onFieldChange('footerCategory3Id', value)}
                        />
                        <SelectField
                            label={`${t('admin.footerCategorySlot') || 'Footer Category'} 4`}
                            value={footerContent.footerCategory4Id}
                            options={categories}
                            onChange={(value) => onFieldChange('footerCategory4Id', value)}
                        />
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-800/40">
                    <SectionTitle
                        title={t('admin.footerSupportSection') || 'Support Section'}
                        description={t('admin.footerSupportSectionDescription') || 'Edit the support column heading and each footer support link.'}
                    />

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <TextField
                            label={`${t('admin.englishLabel') || 'English Label'} (${t('admin.title')})`}
                            value={footerContent.footerSupportTitle}
                            onChange={(value) => onFieldChange('footerSupportTitle', value)}
                        />
                        <div dir="rtl">
                            <TextField
                                label={`${t('admin.arabicLabel') || 'Arabic Label'} (${t('admin.title')})`}
                                value={footerContent.footerSupportTitleAr}
                                onChange={(value) => onFieldChange('footerSupportTitleAr', value)}
                            />
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        <LinkEditor
                            title={`${t('admin.footerLinkItem') || 'Footer Link'} 1`}
                            labelValue={footerContent.footerSupportLink1Label}
                            labelArValue={footerContent.footerSupportLink1LabelAr}
                            urlValue={footerContent.footerSupportLink1Url}
                            onFieldChange={onFieldChange}
                            labelKey="footerSupportLink1Label"
                            labelArKey="footerSupportLink1LabelAr"
                            urlKey="footerSupportLink1Url"
                            t={t}
                        />
                        <LinkEditor
                            title={`${t('admin.footerLinkItem') || 'Footer Link'} 2`}
                            labelValue={footerContent.footerSupportLink2Label}
                            labelArValue={footerContent.footerSupportLink2LabelAr}
                            urlValue={footerContent.footerSupportLink2Url}
                            onFieldChange={onFieldChange}
                            labelKey="footerSupportLink2Label"
                            labelArKey="footerSupportLink2LabelAr"
                            urlKey="footerSupportLink2Url"
                            t={t}
                        />
                        <LinkEditor
                            title={`${t('admin.footerLinkItem') || 'Footer Link'} 3`}
                            labelValue={footerContent.footerSupportLink3Label}
                            labelArValue={footerContent.footerSupportLink3LabelAr}
                            urlValue={footerContent.footerSupportLink3Url}
                            onFieldChange={onFieldChange}
                            labelKey="footerSupportLink3Label"
                            labelArKey="footerSupportLink3LabelAr"
                            urlKey="footerSupportLink3Url"
                            t={t}
                        />
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-800/40">
                    <SectionTitle
                        title={t('admin.footerCompanySection') || 'Company Section'}
                        description={t('admin.footerCompanySectionDescription') || 'Edit the company column heading and up to three footer links.'}
                    />

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <TextField
                            label={`${t('admin.englishLabel') || 'English Label'} (${t('admin.title')})`}
                            value={footerContent.footerCompanyTitle}
                            onChange={(value) => onFieldChange('footerCompanyTitle', value)}
                        />
                        <div dir="rtl">
                            <TextField
                                label={`${t('admin.arabicLabel') || 'Arabic Label'} (${t('admin.title')})`}
                                value={footerContent.footerCompanyTitleAr}
                                onChange={(value) => onFieldChange('footerCompanyTitleAr', value)}
                            />
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        <LinkEditor
                            title={`${t('admin.footerLinkItem') || 'Footer Link'} 1`}
                            labelValue={footerContent.footerCompanyLink1Label}
                            labelArValue={footerContent.footerCompanyLink1LabelAr}
                            urlValue={footerContent.footerCompanyLink1Url}
                            onFieldChange={onFieldChange}
                            labelKey="footerCompanyLink1Label"
                            labelArKey="footerCompanyLink1LabelAr"
                            urlKey="footerCompanyLink1Url"
                            t={t}
                        />
                        <LinkEditor
                            title={`${t('admin.footerLinkItem') || 'Footer Link'} 2`}
                            labelValue={footerContent.footerCompanyLink2Label}
                            labelArValue={footerContent.footerCompanyLink2LabelAr}
                            urlValue={footerContent.footerCompanyLink2Url}
                            onFieldChange={onFieldChange}
                            labelKey="footerCompanyLink2Label"
                            labelArKey="footerCompanyLink2LabelAr"
                            urlKey="footerCompanyLink2Url"
                            t={t}
                        />
                        <LinkEditor
                            title={`${t('admin.footerLinkItem') || 'Footer Link'} 3`}
                            labelValue={footerContent.footerCompanyLink3Label}
                            labelArValue={footerContent.footerCompanyLink3LabelAr}
                            urlValue={footerContent.footerCompanyLink3Url}
                            onFieldChange={onFieldChange}
                            labelKey="footerCompanyLink3Label"
                            labelArKey="footerCompanyLink3LabelAr"
                            urlKey="footerCompanyLink3Url"
                            t={t}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
